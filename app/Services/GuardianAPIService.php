<?php

namespace App\Services;

class GuardianAPIService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GUARDIAN_KEY');
    }

    public function fetchArticles()
    {
        try
        {
            $url      = 'https://content.guardianapis.com/search?page-size=100&page=1&format=json&show-fields=byline,thumbnail,body&api-key=' . $this->apiKey;
            $response = json_decode(file_get_contents($url));

            return collect($response->response->results)
                ->filter(function ($article)
                {
                    return ! empty($article->webTitle) && ! empty($article->fields->body) && ! is_null($article->fields->thumbnail ?? null) && ! is_null($article->fields->byline ?? null) && ! is_null($article->pillarName ?? null);
                })
                ->map(function ($article)
                {
                    return [
                        'title'        => $article->webTitle ?? null,
                        'description'  => $article->fields->body ?? null,
                        'external_url' => $article->webUrl ?? null,
                        'image_url'    => $article->fields->thumbnail ?? null,
                        'category'     => $article->pillarName ?? null,
                        'subcategory'  => $article->sectionName ?? null,
                        'source'       => 'The Guardian',
                        'source_url'   => 'https://www.theguardian.com',
                        'author'       => $article->fields->byline ?? null,
                        'api_used'     => 'content.guardianapis.com',
                        'published_at' => $article->webPublicationDate ?? null,
                    ];
                });
        }
        catch ( \Exception $e )
        {
            return collect();
        }

    }
}