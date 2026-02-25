<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            return DB::transaction(function () use ($request): JsonResponse {
                $user = User::create([
                    'name' => $request->validated('name'),
                    'email' => $request->validated('email'),
                    'password' => Hash::make($request->validated('password')),
                ]);

                $token = $user->createToken('api')->plainTextToken;

                return response()->json([
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'user' => new UserResource($user),
                ], 201);
            });
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while registering. Please try again.',
            ], 500);
        }
    }

    /**
     * Login and issue a token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->validated('email'))->first();

            if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            return DB::transaction(function () use ($user): JsonResponse {
                $token = $user->createToken('api')->plainTextToken;

                return response()->json([
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'user' => new UserResource($user),
                ]);
            });
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'An error occurred while logging in. Please try again.',
            ], 500);
        }
    }
}
