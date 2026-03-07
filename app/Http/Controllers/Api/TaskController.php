<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTaskRequest;
use App\Http\Requests\Api\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a paginated listing of tasks for the project.
     *
     * Query params: search, due_from (Y-m-d), due_to (Y-m-d), status, priority, sort, per_page (5-50), page.
     */
    public function index(Request $request, int $project): JsonResponse
    {
        try {
            $projectModel = Project::find($project);

            if (! $projectModel) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $projectModel);

            $perPage = min(max((int) $request->query('per_page', 10), 5), 50);
            $sort = $request->query('sort', 'created_at');
            $allowedSorts = [
                'title' => ['title', 'asc'],
                'title_desc' => ['title', 'desc'],
                'status' => ['status', 'asc'],
                'priority' => ['priority', 'asc'],
                'due_date' => ['due_date', 'desc'],
                'due_date_asc' => ['due_date', 'asc'],
                'created_at' => ['created_at', 'desc'],
                'created_at_asc' => ['created_at', 'asc'],
            ];
            [$sortColumn, $sortDir] = $allowedSorts[$sort] ?? $allowedSorts['created_at'];

            $query = $projectModel->tasks()->orderBy($sortColumn, $sortDir);

            if ($request->filled('search')) {
                $term = '%'.addcslashes($request->query('search'), '%_').'%';
                $query->where(function ($q) use ($term): void {
                    $q->where('title', 'ilike', $term)
                        ->orWhere('description', 'ilike', $term);
                });
            }
            if ($request->filled('status')) {
                $query->where('status', $request->query('status'));
            }
            if ($request->filled('priority')) {
                $query->where('priority', $request->query('priority'));
            }
            if ($request->filled('due_from')) {
                $from = $request->date('due_from');
                if ($from) {
                    $query->whereDate('due_date', '>=', $from);
                }
            }
            if ($request->filled('due_to')) {
                $to = $request->date('due_to');
                if ($to) {
                    $query->whereDate('due_date', '<=', $to);
                }
            }

            $tasks = $query->paginate($perPage);

            return response()->json([
                'data' => TaskResource::collection($tasks->items()),
                'meta' => [
                    'current_page' => $tasks->currentPage(),
                    'last_page'    => $tasks->lastPage(),
                    'per_page'     => $tasks->perPage(),
                    'total'        => $tasks->total(),
                    'from'         => $tasks->firstItem(),
                    'to'           => $tasks->lastItem(),
                ],
            ]);
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while fetching tasks. Please try again.',
            ], 500);
        }
    }

    /**
     * Store a newly created task in the project.
     */
    public function store(StoreTaskRequest $request, int $project): JsonResponse
    {
        try {
            $projectModel = Project::find($project);

            if (! $projectModel) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $projectModel);

            return DB::transaction(function () use ($request, $projectModel): JsonResponse {
                $task = $projectModel->tasks()->create($request->validated());

                return response()->json(new TaskResource($task), 201);
            });
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while creating the task. Please try again.',
            ], 500);
        }
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, int $project, int $task): JsonResponse
    {
        try {
            $projectModel = Project::find($project);

            if (! $projectModel) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $projectModel);

            $taskModel = Task::where('project_id', $project)->find($task);

            if (! $taskModel) {
                return response()->json(['message' => 'Task not found.'], 404);
            }

            return DB::transaction(function () use ($request, $taskModel): JsonResponse {
                $taskModel->update($request->validated());

                return response()->json(new TaskResource($taskModel->fresh()));
            });
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while updating the task. Please try again.',
            ], 500);
        }
    }

    /**
     * Remove the specified task.
     */
    public function destroy(int $project, int $task): JsonResponse
    {
        try {
            $projectModel = Project::find($project);

            if (! $projectModel) {
                return response()->json(['message' => 'Project not found.'], 404);
            }

            $this->authorize('view', $projectModel);

            $taskModel = Task::where('project_id', $project)->find($task);

            if (! $taskModel) {
                return response()->json(['message' => 'Task not found.'], 404);
            }

            DB::transaction(function () use ($taskModel): void {
                $taskModel->delete();
            });

            return response()->json(null, 204);
        } catch (AuthorizationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while deleting the task. Please try again.',
            ], 500);
        }
    }
}
