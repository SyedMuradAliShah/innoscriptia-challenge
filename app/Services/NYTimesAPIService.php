<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
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
            $url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' . $this->apiKey;
            $response = Http::get($url);

            if ($response->successful()) {
                return collect($response->json()['results'])->filter(function ($article) {
                    return ! empty($article['title']) && ! empty($article['abstract']) && ! empty($article['url']) && ! empty($article['multimedia'][0]['url'] ?? null) && ! empty($article['section']);
                })
                ->map(function ($article) {
                    return [
                        'title'        => $article['title'],
                        'description'  => $article['abstract'],
                        'external_url' => $article['url'],
                        'image_url'    => $article['multimedia'][0]['url'] ?? null,
                        'category'     => Str::upper($article['section']),
                        'subcategory'  => Str::upper($article['subsection']),
                        'source'       => 'The New York Times',
                        'source_url'   => 'https://www.nytimes.com',
                        'author'       => $this->getFirstAuthor($article['byline'] ?? null),
                        'api_used'     => 'api.nytimes.com',
                        'published_at' => $article['published_date'],
                    ];
                });
            }

            throw new \Exception('Failed to fetch articles from The New York Times API');

        }
        catch (\Exception $e)
        {
            return collect();
        }
    }

    protected function getFirstAuthor($authors)
    {
        // Remove "By" prefix and trim whitespace
        $authors = Str::replaceFirst('By ', '', $authors);

        // Return the first author if there are multiple authors
        return Str::contains($authors, ',') ? Str::before($authors, ',') : $authors;

    }
}
