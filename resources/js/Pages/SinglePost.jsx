import { Head, Link } from '@inertiajs/react';
import DefaultLayout from '@/Layouts/DefaultLayout';

export default function SinglePost({ article }) {
    return (
        <>
            <Head title={article.title} />
            <DefaultLayout>
                <nav aria-label="breadcrumb" className="bg-light pt-4">
                    <div className="container">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link href={route('home')}>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{article.title}</li>
                        </ol>
                    </div>
                </nav>

                <div className="container py-4 news-item">
                    <div className="mb-4">
                        <h1 className="h3">{article.title}</h1>
                        <p className="text-muted">
                            {article.source_url && (
                                <a href={article.source_url} className='text-primary fw-semibold text-decoration-none small' target="_blank" rel="noopener noreferrer">{article.source} </a>
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

                        <div className="mb-3">
                            <img src={article.image_url} alt="Blog Image" className="img-fluid w-100 news-image" />
                        </div>
                        <div className="content">
                            <p>{article.description}</p>
                            <p>

                                {article.external_url && (
                                    <a href={article.external_url} className='text-primary text-decoration-none small position-relative z-1' target="_blank" rel="noopener noreferrer">Read full on source</a>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}
