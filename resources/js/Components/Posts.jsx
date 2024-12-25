import { Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Posts({ articles, links }) {
    return (
        <>
            <div className="row gy-4">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div className="col-12" key={article.id}>
                            <div className="card shadow-sm position-relative">
                                <Link href={`/articles/${article.slug}`} className="stretched-link"></Link>
                                <div className="row g-0 flex-column-reverse flex-md-row">
                                    <div className="col-md-9">
                                        <div className="card-body position-relative">
                                            <h5 className="card-title">{article.title}</h5>
                                            <p className="card-text position-relative z-1">
                                                {article.excerpt}
                                            </p>
                                            <p className="card-text text-muted small position-relative z-1">
                                                {article.source_url && (
                                                    <a href={article.source_url} className='text-primary fw-semibold text-decoration-none' target="_blank" rel="noopener noreferrer">{article.source} </a>
                                                )}

                                                {article.category && (
                                                    <>
                                                        In <span className="text-primary fw-semibold">{article.category.name} {article.subcategory ? `> ${article.subcategory.name}` : ''} </span>
                                                    </>
                                                )}
                                                {article.author && (
                                                    <>
                                                        by <span className="text-primary fw-semibold">{article.author}</span> •
                                                    </>
                                                )} {article.published_at}
                                            </p>

                                            <p>
                                                {article.external_url && (
                                                    <a href={article.external_url} className='text-primary text-decoration-none small position-relative z-1' target="_blank" rel="noopener noreferrer">Read full on source</a>
                                                )}

                                                <span className="text-primary text-decoration-none small float-end">Read More Here »</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 d-flex align-items-center">
                                        <img src={article.image_url} alt="News Image" className="img-fluid w-100 news-image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card h-100 text-center py-5">
                            <div class="card-body">
                                <h5 class="card-title">
                                    No articles found. Try adjusting your search criteria.
                                </h5>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {articles.length > 0 && <Pagination links={links} />}
        </>

    );
}
