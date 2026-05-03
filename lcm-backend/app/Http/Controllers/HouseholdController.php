<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Household;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class HouseholdController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->households);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'daily_budget' => 'required|numeric|min:0',
        ]);

        $household = DB::transaction(function () use ($request) {
            $household = Household::create([
                'name' => $request->name,
                'daily_budget' => $request->daily_budget,
            ]);

            $household->users()->attach($request->user()->id, ['role' => 'admin']);

            return $household;
        });

        return response()->json($household, 201);
    }

    public function show(Request $request, Household $household)
    {
        if (!$request->user()->households()->where('household_id', $household->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $household->load('users');

        return response()->json($household);
    }

    public function invite(Request $request, Household $household)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Ensure current user is admin of this household
        $userHousehold = $request->user()->households()->where('household_id', $household->id)->first();
        if (!$userHousehold || $userHousehold->pivot->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userToInvite = User::where('email', $request->email)->first();

        if ($household->users()->where('user_id', $userToInvite->id)->exists()) {
            return response()->json(['message' => 'User already in household'], 400);
        }

        $household->users()->attach($userToInvite->id, ['role' => 'member']);

        return response()->json(['message' => 'User invited successfully']);
    }

    public function removeMember(Request $request, Household $household, User $user)
    {
        // Ensure current user is admin of this household
        $userHousehold = $request->user()->households()->where('household_id', $household->id)->first();
        if (!$userHousehold || $userHousehold->pivot->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot remove yourself
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot remove yourself'], 400);
        }

        $household->users()->detach($user->id);

        return response()->json(['message' => 'User removed successfully']);
    }
}
