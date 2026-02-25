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
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $projects = $request->user()
                ->projects()
                ->with('tasks')
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json(ProjectResource::collection($projects));
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
     */
    public function show(int $project): JsonResponse
    {
        try {
            $model = Project::with('tasks')->find($project);

            if (! $model) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $model);

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
