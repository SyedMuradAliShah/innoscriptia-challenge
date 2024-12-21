<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Category;
use App\Services\GuardianAPIService;
use App\Services\NewsAPIService;
use App\Services\NYTimesAPIService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scarpe articles from APIs and store them in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::error('ScrapeArticles command started.');

        $apis = [ new NewsAPIService(), new GuardianAPIService(), new NYTimesAPIService() ];

        foreach ($apis as $api)
        {
            try
            {
                Log::error('Fetching articles from ' . class_basename($api) . '...');
                $articles = $api->fetchArticles();

                Log::error('Processing articles from ' . class_basename($api) . '...');
                $this->processArticles($articles);

                Log::error('Articles from ' . class_basename($api) . ' processed successfully.');
                $this->info('Articles from ' . class_basename($api) . ' processed successfully.');
            }
            catch ( \Exception $e )
            {
                Log::error('Failed to process articles from ' . class_basename($api) . ': ' . $e->getMessage() . ' ' . $e->getTraceAsString() . ' ' . $e->getFile() . ' ' . $e->getLine());

                $this->error('Failed to process articles from ' . class_basename($api) . ': ' . $e->getMessage());
            }
        }
    }

    protected function processArticles($articles) : void
    {
        if ($articles->isEmpty())
        {
            $this->warn('No articles to process.');
            return;
        }

        DB::transaction(function () use ($articles)
        {
            $categoriesData    = $this->extractCategories($articles);
            $subcategoriesData = $this->extractSubcategories($articles);

            $categoryIds    = $this->storeCategories($categoriesData);
            $subcategoryIds = $this->storeSubcategories($subcategoriesData, $categoryIds);

            $existingSlugs = $this->getExistingSlugs($articles);

            $articleData = $this->prepareArticles($articles, $categoryIds, $subcategoryIds, $existingSlugs);

            $this->storeArticles($articleData);
        });
    }

    /**
     * Extract unique categories from new articles.
     */
    protected function extractCategories($articles) : array
    {
        $categoriesData = [];

        foreach ($articles as $article)
        {
            if (! empty($article['category']))
            {
                $categoriesData[$article['category']] = [ 'name' => $article['category'], 'parent_id' => null ];
            }
        }

        return $categoriesData;
    }

    /**
     * Extract unique subcategories from new articles.
     */
    protected function extractSubcategories($articles) : array
    {
        $subcategoriesData = [];

        foreach ($articles as $article)
        {
            if (! empty($article['subcategory']) && ! empty($article['category']))
            {
                $subcategoriesData[$article['subcategory']] = [
                    'name'      => $article['subcategory'],
                    'parent_id' => null, // will be map it later
                ];
            }
        }

        return $subcategoriesData;
    }

    /**
     * Store categories in the database and return their IDs.
     */
    protected function storeCategories(array $categoriesData) : array
    {
        Category::upsert($categoriesData, [ 'name', 'parent_id' ]);

        return Category::whereIn('name', array_keys($categoriesData))
            ->pluck('id', 'name')
            ->toArray();
    }

    /**
     * Store subcategories in the database, mapping their parent IDs.
     */
    protected function storeSubcategories(array $subcategoriesData, array $categoryIds) : array
    {
        foreach ($subcategoriesData as $data)
        {
            $data['parent_id'] = $categoryIds[$data['parent_id']] ?? null;
        }

        Category::upsert($subcategoriesData, [ 'name', 'parent_id' ]);

        return Category::whereIn('name', array_keys($subcategoriesData))
            ->pluck('id', 'name')
            ->toArray();
    }

    /**
     * Retrieve existing slugs to avoid duplicates.
     */
    protected function getExistingSlugs($articles) : array
    {
        $titles = $articles->pluck('title')
            ->map(fn ($title) => Str::slug($title))->toArray();

        return Article::whereIn('slug', $titles)
            ->pluck('slug')->toArray();
    }

    /**
     * Prepare articles for bulk insertion, including category and subcategory IDs.
     */
    protected function prepareArticles($articles, array $categoryIds, array $subcategoryIds, array $existingSlugs) : array
    {
        $articleData = [];

        foreach ($articles as $article)
        {

            $slug = Str::slug($article['title']);

            // Skip if slug already exists
            if (in_array($slug, $existingSlugs))
            {
                continue;
            }

            $articleData[] = [
                'slug'           => $slug,
                'title'          => $article['title'],
                'description'    => $article['description'],
                'author'         => $article['author'],
                'external_url'   => $article['external_url'],
                'source'         => $article['source'],
                'source_url'     => $article['source_url'],
                'image_url'      => $article['image_url'],
                'api_used'       => $article['api_used'],
                'published_at'   => $article['published_at'],
                'category_id'    => $categoryIds[$article['category']] ?? null,
                'subcategory_id' => $subcategoryIds[$article['subcategory']] ?? null,
            ];
        }

        return $articleData;
    }

    /**
     * Store articles in the database in bulk.
     */
    protected function storeArticles(array $articleData) : void
    {
        Article::insert($articleData);
    }
}
