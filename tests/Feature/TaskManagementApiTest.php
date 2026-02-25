<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_user_and_returns_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJson([
                'token_type' => 'Bearer',
                'user' => [
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'token_type', 'user'])
            ->assertJson(['token_type' => 'Bearer']);
    }

    public function test_user_can_create_project_and_crud_tasks(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $createProject = $this->postJson('/api/projects', [
            'name' => 'My Project',
            'description' => 'Project description',
        ]);
        $createProject->assertStatus(201)
            ->assertJsonPath('name', 'My Project')
            ->assertJsonPath('description', 'Project description');

        $projectId = $createProject->json('id');

        $createTask = $this->postJson("/api/projects/{$projectId}/tasks", [
            'title' => 'First task',
            'description' => 'Task description',
            'status' => 'todo',
            'priority' => 'high',
        ]);
        $createTask->assertStatus(201)
            ->assertJsonPath('title', 'First task')
            ->assertJsonPath('status', 'todo')
            ->assertJsonPath('priority', 'high');

        $taskId = $createTask->json('id');

        $updateTask = $this->patchJson("/api/projects/{$projectId}/tasks/{$taskId}", [
            'status' => 'in_progress',
        ]);
        $updateTask->assertStatus(200)
            ->assertJsonPath('status', 'in_progress');

        $deleteTask = $this->deleteJson("/api/projects/{$projectId}/tasks/{$taskId}");
        $deleteTask->assertStatus(204);
    }

    public function test_user_cannot_access_another_users_project(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $project = Project::factory()->for($owner)->create(['name' => 'Private Project']);

        Sanctum::actingAs($other);

        $response = $this->getJson("/api/projects/{$project->id}");
        $response->assertStatus(403);
    }
}
