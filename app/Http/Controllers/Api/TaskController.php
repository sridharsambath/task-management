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
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
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
