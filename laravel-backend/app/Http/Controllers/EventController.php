<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    // List all events
    public function index()
    {
        Log::info('Fetching all events');
        $events = Event::all();
        return response()->json($events);
    }

    // Show single event by id
    public function show($id)
    {
        Log::info("Fetching event with ID: {$id}");
        
        $event = Event::find($id);
        if (!$event) {
            Log::error("Event with ID {$id} not found");
            return response()->json(['error' => 'Event not found'], 404);
        }

        return response()->json($event);
    }

    // Create a new event (user must be authenticated)
    public function store(Request $request)
    {
           $userId = 5;  // you can set this to any existing admin user ID
           console.log( $userId);
    Log::info('Creating a new event', [
        'user_id' => $userId,
        'request_data' => $request->all(),
    ]);

        // Log::info('Creating a new event', [
        //     'user_id' => Auth::id(),
        //     'request_data' => $request->all(),
        // ]);

        // Uncomment for deep debugging
        // dd($request->all());

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string', // URL or path to image
            'price' => 'required|numeric',
        ]);

        try {
            $event = Event::create([
                      'user_id' => $userId,  // Make sure this is not null

                'title' => $request->title,
                'description' => $request->description,
                'image' => $request->image,
                'price' => $request->price,
            ]);

            Log::info('Event created successfully', ['event' => $event]);
            return response()->json($event, 201);
        } catch (\Exception $e) {
            Log::error('Failed to create event', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create event'], 500);
        }
    }

 public function update(Request $request, $id)
{
    $userId = 5; // hardcoded user

    Log::info("Updating event with ID: {$id}");

    $event = Event::find($id);
    if (!$event) {
        Log::error("Event with ID {$id} not found");
        return response()->json(['error' => 'Event not found'], 404);
    }

    if ($event->user_id !== $userId) {
        Log::warning("Unauthorized update attempt by user ID: {$userId}");
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $request->validate([
        'title' => 'sometimes|required|string|max:255',
        'description' => 'sometimes|required|string',
        'image' => 'nullable|string',
        'price' => 'sometimes|required|numeric',
    ]);

    try {
        $event->update($request->only(['title', 'description', 'image', 'price']));
        Log::info("Event with ID {$id} updated successfully", ['event' => $event]);
        return response()->json($event);
    } catch (\Exception $e) {
        Log::error("Failed to update event with ID {$id}", ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Failed to update event'], 500);
    }
}

public function destroy($id)
{
    $userId = 5; // hardcoded user

    Log::info("Deleting event with ID: {$id}");

    $event = Event::find($id);
    if (!$event) {
        Log::error("Event with ID {$id} not found");
        return response()->json(['error' => 'Event not found'], 404);
    }

    if ($event->user_id !== $userId) {
        Log::warning("Unauthorized delete attempt by user ID: {$userId}");
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
        $event->delete();
        Log::info("Event with ID {$id} deleted successfully");
        return response()->json(['message' => 'Event deleted successfully']);
    } catch (\Exception $e) {
        Log::error("Failed to delete event with ID {$id}", ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Failed to delete event'], 500);
    }
}
}
