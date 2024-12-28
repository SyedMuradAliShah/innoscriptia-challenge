<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserFeedController extends Controller
{
    /**
     * Display the user's personalized feed based on their preferences and optional filters.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Retrieve or create the authenticated user's preferences.
        $userPreferences = UserPreference::firstOrCreate(
            [ 'user_id' => auth()->id() ],
        );

        // Initialize the query with related subcategory and category, ordered by latest publication date.
        $query = Article::with('subcategory', 'category')->latest('published_at');

        // Apply user preference filters: sources, authors, and categories.
        $query->where(function ($q) use ($userPreferences) {
            if (!empty($userPreferences->sources)) {
                $q->whereIn('source', $userPreferences->sources);
            }
        
            if (!empty($userPreferences->authors)) {
                $q->orWhereIn('author', $userPreferences->authors);
            }
        
            if (!empty($userPreferences->categories)) {
                $q->orWhereHas('category', function ($subQuery) use ($userPreferences) {
                    $subQuery->whereIn('name', $userPreferences->categories);
                });
            }
        });

        // Apply additional filters based on request parameters.
        if ($request->filled('q'))
        {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        if ($request->filled('date'))
        {
            $query->whereDate('published_at', $request->date);
        }

        if ($request->filled('category'))
        {
            $query->whereHas('category', function ($q) use ($request)
            {
                $q->where('name', $request->category);
            });
        }

        if ($request->filled('author'))
        {
            $query->where('author', $request->author);
        }

        if ($request->filled('source'))
        {
            $query->where('source', $request->source);
        }

        // Paginate the results, 10 articles per page.
        $articles = $query->paginate(10);

        // Prepare categories based on user preferences for the filter dropdown.
        $categories = Category::whereIn('name', $userPreferences->categories ?? [])
            ->get()
            ->map(function ($category)
            {
                return [ 'value' => $category->name, 'label' => $category->name ];
            });

        // Prepare authors based on user preferences for the filter dropdown.
        $authors = Article::whereIn('author', $userPreferences->authors ?? [])
            ->select('author')
            ->distinct()
            ->orderBy('author')
            ->get()
            ->filter(function ($author)
            {
                return ! is_null($author->author) && $author->author !== ''; // Filter out null or empty authors.
            })->map(function ($author)
            {
                return [ 'value' => $author->author, 'label' => $author->author ];
            })->values();

        // Prepare sources based on user preferences for the filter dropdown.
        $sources = Article::whereIn('source', $userPreferences->sources ?? [])
            ->select('source')
            ->distinct()
            ->orderBy('source')
            ->get()
            ->filter(function ($source)
            {
                return ! is_null($source->source) && $source->source !== ''; // Filter out null or empty sources.
            })->map(function ($source)
            {
                return [ 'value' => $source->source, 'label' => $source->source ];
            })->values();

        // Render the MyFeed view with the prepared data.
        return Inertia::render('MyFeed', [
            'articles'   => collect($articles->items())->map(function ($article)
            {
                return [
                    'id'           => $article->id,
                    'slug'         => $article->slug,
                    'title'        => $article->title,
                    'excerpt'      => Str::limit(strip_tags($article->description), 250),
                    'category'     => $article->category,
                    'subcategory'  => $article->subcategory,
                    'source'       => $article->source,
                    'source_url'   => $article->source_url,
                    'external_url' => $article->external_url,
                    'author'       => $article->author,
                    'published_at' => $article->published_at->diffForHumans(),
                    'image_url'    => $article->image_url,
                ];
            }),
            'links'      => $articles->linkCollection()->toArray(),
            'categories' => $categories,
            'authors'    => $authors,
            'sources'    => $sources,
            'filters'    => $request->only([ 'q', 'date', 'category', 'author', 'source' ]),
        ]);
    }
}
