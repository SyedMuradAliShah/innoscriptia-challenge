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
    /**
     * Display the user's current preferences along with available options.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Prepare categories for the preferences dropdown.
        $categories = Category::all()->map(function ($category)
        {
            return [ 'value' => $category->name, 'label' => $category->name ];
        });

        // Prepare authors for the preferences dropdown.
        $authors = Article::select('author')->distinct()->orderBy('author')->get()->filter(function ($author)
        {
            return ! is_null($author->author) && $author->author !== ''; // Filter out null or empty authors.
        })->map(function ($author)
        {
            return [ 'value' => $author->author, 'label' => $author->author ];
        })->values();

        // Prepare sources for the preferences dropdown.
        $sources = Article::select('source')->distinct()->orderBy('source')->get()->filter(function ($source)
        {
            return ! is_null($source->source) && $source->source !== ''; // Filter out null or empty sources.
        })->map(function ($source)
        {
            return [ 'value' => $source->source, 'label' => $source->source ];
        })->values();


        // Retrieve the authenticated user's preferences.
        $userPreferences = UserPreference::where('user_id', auth()->id())->first();

        // Ensure user preferences arrays are valid.
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

    /**
     * Store a new user preference of a given type.
     *
     * @param Request $request
     * @param string $type
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $type)
    {
        // Validate the preference type.
        if (! in_array($type, [ 'category', 'author', 'source' ]))
        {
            abort(404);
        }


        // Validate the incoming preference data.
        $validated = $request->validate([
            'preference' => 'required|string',
        ]);

        // Retrieve or create the user's preference record.
        $userPreferences = UserPreference::firstOrCreate(
            [ 'user_id' => auth()->id() ],
        );

        // Pluralize the type to match the database field.
        $type = Str::plural($type);

        $values = $userPreferences->{$type} ?? [];

        // Add the new preference if it's not already present.
        if (! in_array($validated['preference'], $values))
        {
            $values[]                 = $validated['preference'];
            $userPreferences->{$type} = $values;
            $userPreferences->save();
        }

        return back();
    }

    /**
     * Remove a user preference of a given type.
     *
     * @param Request $request
     * @param string $type
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, $type)
    {
        // Validate the preference type.
        if (! in_array($type, [ 'category', 'author', 'source' ]))
        {
            abort(404);
        }

        // Validate the incoming preference data.
        $validated = $request->validate([
            'preference' => 'required|string',
        ]);

        // Retrieve the user's preference record.
        $userPreferences = UserPreference::where('user_id', auth()->id())->first();

        if ($userPreferences)
        {
            // Pluralize the type to match the database field.
            $type = Str::plural($type);
            // Remove the specified preference from the array.
            $values                   = $userPreferences->{$type} ?? [];
            $values                   = array_values(array_filter($values, fn ($v) => $v !== $validated['preference']));
            $userPreferences->{$type} = $values;
            $userPreferences->save();
        }

        return back();
    }
}
