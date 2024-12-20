<?php

namespace App\Services;

use Illuminate\Support\Str;

class NYTimesAPIService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('NYTIMES_KEY');
    }

    public function fetchArticles()
    {
        try
        {
            $url      = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' . $this->apiKey;
            $response = json_decode(file_get_contents($url));

            return collect($response->results)->filter(function ($article)
            {
                return ! empty($article->title) && ! empty($article->abstract) && ! empty($article->url) && ! empty($article->multimedia[0]->url ?? null) && ! empty($article->byline) && ! empty($article->section);
            })
                ->map(function ($article)
                {
                    return [
                        'title'        => $article->title,
                        'description'  => $article->abstract,
                        'external_url' => $article->url,
                        'image_url'    => $article->multimedia[0]->url ?? null,
                        'category'     => Str::upper($article->section),
                        'subcategory'  => Str::upper($article->subsection),
                        'source'       => 'The New York Times',
                        'source_url'   => 'https://www.nytimes.com',
                        'author'       => $article->byline,
                        'api_used'     => 'api.nytimes.com',
                        'published_at' => $article->published_date,
                    ];
                });
        }
        catch ( \Exception $e )
        {
            return collect();
        }

    }
}
