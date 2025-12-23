<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UserSettings;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserSettingsController extends Controller
{
    /**
     * Mostrar as preferências do utilizador
     */
    public function show()
    {
        $settings = UserSettings::where('user_id', auth()->id())->first();

        return response()->json($settings);
    }

    /**
     * Guardar ou atualizar preferências
     */
    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $validated = $request->validate([
            'currency_id'      => 'required|exists:currencies,id',
            'monthly_budget'   => 'nullable|numeric|min:0',
            'month_start_day'  => 'required|integer|min:1|max:28',
        ]);

        $settings = UserSettings::updateOrCreate(
            ['user_id' => $userId],
            $validated
        );

        return response()->json([
            'message' => 'Preferências guardadas com sucesso',
            'data'    => $settings
        ]);
    }

    /**
     * Atualizar preferências (PUT/PATCH)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'currency_id'      => 'sometimes|exists:currencies,id',
            'monthly_budget'   => 'nullable|numeric|min:0',
            'month_start_day'  => 'sometimes|integer|min:1|max:28',
        ]);

        $settings = UserSettings::where('user_id', $request->user()->id)->firstOrFail();
        $settings->update($validated);

        return response()->json([
            'message' => 'Preferências atualizadas',
            'data'    => $settings
        ]);
    }
}
