<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status');
            $table->string('priority');
            $table->date('due_date')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
        });

        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in_progress', 'done'))");
            DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('low', 'medium', 'high'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
