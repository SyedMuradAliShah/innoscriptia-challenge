<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('subcategory', 'category')->latest('published_at');

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

        $articles = $query->paginate(10);

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


        return Inertia::render('Home', [
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
            'filters'    => $request->only([ 'q', 'date', 'category', 'author' ]),
        ]);
    }

    public function show($slug)
    {
        $article = Article::where('slug', $slug)->with('category', 'subcategory')->firstOrFail();

        return Inertia::render('SinglePost', [
            'article' => [
                'id'           => $article->id,
                'slug'         => $article->slug,
                'title'        => $article->title,
                'description'  => $article->description,
                'category'     => $article->category,
                'subcategory'  => $article->subcategory,
                'source'       => $article->source,
                'source_url'   => $article->source_url,
                'external_url' => $article->external_url,
                'author'       => $article->author,
                'published_at' => $article->published_at->diffForHumans(),
                'image_url'    => $article->image_url,
            ],
        ]);
    }
}
