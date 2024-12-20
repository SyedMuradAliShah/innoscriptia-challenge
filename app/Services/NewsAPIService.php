<?php

namespace App\Services;

use Illuminate\Support\Str;
use jcobhams\NewsApi\NewsApi;

class NewsAPIService
{
    protected $newsapi;

    public function __construct()
    {
        $this->newsapi = new NewsApi(env('NEWSAPI_KEY'));
    }

    public function fetchArticles()
    {

        try
        {
            $sourcesResponse = $this->newsapi->getSources(country: 'us');

            $sources = collect($sourcesResponse->sources ?? []);

            $news = $this->newsapi->getTopHeadlines(country: 'us');

            return collect($news->articles)->filter(function ($article)
            {
                return ! empty($article->title) && Str::lower($article->title) !== '[removed]';
            })
                ->map(function ($article) use ($sources)
                {
                    $source = $sources->firstWhere('id', $article->source->id ?? null);

                    return [
                        'title'         => $article->title,
                        'description'   => $article->description,
                        'external_url' => $article->url,
                        'image_url'     => $article->urlToImage,
                        'category'      => $source?->category,
                        'subcategory'   => null,
                        'source'        => $article->source->name ?? null,
                        'source_url'    => $source?->url ?? null,
                        'author'        => $article->author,
                        'api_used'      => 'newsapi.org',
                        'published_at'  => $article->publishedAt,
                    ];
                });
        }
        catch ( \Exception $e )
        {
            return collect();
        }

    }
}
