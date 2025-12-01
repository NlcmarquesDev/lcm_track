<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMonthsRequest;
use App\Http\Requests\Api\V1\UpdateMonthsRequest;
use App\Http\Resources\MonthsResource;
use App\Models\Months;

class MonthsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return MonthsResource::collection(Months::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMonthsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Months $months)
    {
        //
        return new MonthsResource($months);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Months $months)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMonthsRequest $request, Months $months)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Months $months)
    {
        //
    }
}
