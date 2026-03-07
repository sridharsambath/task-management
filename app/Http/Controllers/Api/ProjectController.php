<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreProjectRequest;
use App\Http\Requests\Api\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of the user's projects.
     *
     * Query params: search (optional), sort (name, name_desc, updated_at, updated_at_asc, created_at, created_at_asc), per_page (5-50), page.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = min(max((int) $request->query('per_page', 10), 5), 50);
            $sort = $request->query('sort', 'updated_at');
            $allowedSorts = [
                'name' => ['name', 'asc'],
                'name_desc' => ['name', 'desc'],
                'updated_at' => ['updated_at', 'desc'],
                'updated_at_asc' => ['updated_at', 'asc'],
                'created_at' => ['created_at', 'desc'],
                'created_at_asc' => ['created_at', 'asc'],
            ];
            [$sortColumn, $sortDir] = $allowedSorts[$sort] ?? $allowedSorts['updated_at'];

            $query = $request->user()
                ->projects()
                ->withCount('tasks');

            if ($request->filled('search')) {
                $term = '%'.addcslashes($request->query('search'), '%_').'%';
                $query->where(function ($q) use ($term): void {
                    $q->where('name', 'ilike', $term)
                        ->orWhere('description', 'ilike', $term);
                });
            }

            $projects = $query->orderBy($sortColumn, $sortDir)->paginate($perPage);

            return response()->json([
                'data' => ProjectResource::collection($projects->items()),
                'meta' => [
                    'current_page' => $projects->currentPage(),
                    'last_page'    => $projects->lastPage(),
                    'per_page'     => $projects->perPage(),
                    'total'        => $projects->total(),
                    'from'         => $projects->firstItem(),
                    'to'           => $projects->lastItem(),
                ],
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while fetching projects. Please try again.',
            ], 500);
        }
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Project::class);

            return DB::transaction(function () use ($request): JsonResponse {
                $project = $request->user()->projects()->create($request->validated());

                return response()->json(new ProjectResource($project->load('tasks')), 201);
            });
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while creating the project. Please try again.',
            ], 500);
        }
    }

    /**
     * Display the specified project.
     *
     * Query param: with_tasks (default 1). Set to 0 to skip loading tasks (e.g. when using GET /projects/{id}/tasks for the list).
     */
    public function show(Request $request, int $project): JsonResponse
    {
        try {
            $model = Project::query()->find($project);

            if (! $model) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $model);

            if ($request->query('with_tasks', '1') !== '0') {
                $model->load('tasks');
            }

            return response()->json(new ProjectResource($model));
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while fetching the project. Please try again.',
            ], 500);
        }
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, int $project): JsonResponse
    {
        try {
            $model = Project::find($project);

            if (! $model) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('update', $model);

            return DB::transaction(function () use ($request, $model): JsonResponse {
                $model->update($request->validated());

                return response()->json(new ProjectResource($model->load('tasks')));
            });
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while updating the project. Please try again.',
            ], 500);
        }
    }

    /**
     * Remove the specified project.
     */
    public function destroy(int $project): JsonResponse
    {
        try {
            $model = Project::find($project);

            if (! $model) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('delete', $model);

            DB::transaction(function () use ($model): void {
                $model->delete();
            });

            return response()->json(null, 204);
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while deleting the project. Please try again.',
            ], 500);
        }
    }
}
