<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PreferenceController extends Controller
{
    public function index()
    {

        $categories = Category::all()->map(function ($category)
        {
            return [ 'value' => $category->name, 'label' => $category->name ];
        });

        $authors = Article::select('author')->distinct()->orderBy('author')->get()->filter(function ($author)
        {
            return ! is_null($author->author) && $author->author !== '';
        })->map(function ($author)
        {
            return [ 'value' => $author->author, 'label' => $author->author ];
        })->values();

        $sources = Article::select('source')->distinct()->orderBy('source')->get()->filter(function ($source)
        {
            return ! is_null($source->source) && $source->source !== '';
        })->map(function ($source)
        {
            return [ 'value' => $source->source, 'label' => $source->source ];
        })->values();


        $userPreferences = UserPreference::where('user_id', auth()->id())->first();

        // Fix the preference collection mappings
        $userPreferenceSources = is_array($userPreferences->sources)
            ? $userPreferences->sources
            : [];

        $userPreferenceAuthors = is_array($userPreferences->authors)
            ? $userPreferences->authors
            : [];

        $userPreferenceCategories = is_array($userPreferences->categories)
            ? $userPreferences->categories
            : [];

        return Inertia::render('Preferences/Index', [
            'userPreferences' => [
                'categories' => $userPreferenceCategories,
                'authors'    => $userPreferenceAuthors,
                'sources'    => $userPreferenceSources,
            ],
            'categories'      => $categories,
            'authors'         => $authors,
            'sources'         => $sources,
        ]);

    }

    public function store(Request $request, $type)
    {
        if (! in_array($type, [ 'category', 'author', 'source' ]))
        {
            abort(404);
        }


        $validated = $request->validate([
            'preference' => 'required|string',
        ]);

        $userPreferences = UserPreference::firstOrCreate(
            [ 'user_id' => auth()->id() ],
        );

        $type = Str::plural($type);

        $values = $userPreferences->{$type} ?? [];

        if (! in_array($validated['preference'], $values))
        {
            $values[]                 = $validated['preference'];
            $userPreferences->{$type} = $values;
            $userPreferences->save();
        }

        return back();
    }

    public function destroy(Request $request, $type)
    {
        if (! in_array($type, [ 'category', 'author', 'source' ]))
        {
            abort(404);
        }

        $validated = $request->validate([
            'preference' => 'required|string',
        ]);

        $userPreferences = UserPreference::where('user_id', auth()->id())->first();

        
        if ($userPreferences)
        {
            $type = Str::plural($type);
            $values                   = $userPreferences->{$type} ?? [];
            $values                   = array_values(array_filter($values, fn ($v) => $v !== $validated['preference']));
            $userPreferences->{$type} = $values;
            $userPreferences->save();
        }

        return back();
    }
}
