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
    public function index(Request $request)
    {
        $userPreferences = UserPreference::firstOrCreate(
            [ 'user_id' => auth()->id() ],
        );

        $query = Article::with('subcategory', 'category')->latest('published_at');

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

        $articles = $query->paginate(10);

        $categories = Category::whereIn('name', $userPreferences->categories ?? [])
            ->get()
            ->map(function ($category)
            {
                return [ 'value' => $category->name, 'label' => $category->name ];
            });

        $authors = Article::whereIn('author', $userPreferences->authors ?? [])
            ->select('author')
            ->distinct()
            ->orderBy('author')
            ->get()
            ->filter(function ($author)
            {
                return ! is_null($author->author) && $author->author !== '';
            })->map(function ($author)
            {
                return [ 'value' => $author->author, 'label' => $author->author ];
            })->values();

        $sources = Article::whereIn('source', $userPreferences->sources ?? [])
            ->select('source')
            ->distinct()
            ->orderBy('source')
            ->get()
            ->filter(function ($source)
            {
                return ! is_null($source->source) && $source->source !== '';
            })->map(function ($source)
            {
                return [ 'value' => $source->source, 'label' => $source->source ];
            })->values();


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
