<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

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
            $url = 'https://content.guardianapis.com/search?page-size=100&page=1&format=json&show-fields=byline,thumbnail,body&api-key=' . $this->apiKey;

            $response = Http::get($url);

            if ($response->successful())
            {

                return collect($response->json()['response']['results'])
                    ->filter(function ($article)
                    {
                        return ! empty($article['webTitle']) && ! empty($article['fields']['body']) && ! is_null($article['fields']['thumbnail'] ?? null) && ! is_null($article['pillarName'] ?? null);
                    })
                    ->map(function ($article)
                    {
                        return [
                            'title'        => $article['webTitle'] ?? null,
                            'description'  => $article['fields']['body'] ?? null,
                            'external_url' => $article['webUrl'] ?? null,
                            'image_url'    => $article['fields']['thumbnail'] ?? null,
                            'category'     => $article['pillarName'] ?? null,
                            'subcategory'  => $article['sectionName'] ?? null,
                            'source'       => 'The Guardian',
                            'source_url'   => 'https://www.theguardian.com',
                            'author'       => $this->getFirstAuthor($article['fields']['byline'] ?? null),
                            'api_used'     => 'content.guardianapis.com',
                            'published_at' => $article['webPublicationDate'] ?? null,
                        ];
                    });
            }

            throw new \Exception('Failed to fetch articles from The Guardian API');

        }
        catch ( \Exception $e )
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
