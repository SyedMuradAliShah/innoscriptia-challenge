import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import DefaultLayout from '@/Layouts/DefaultLayout';
import Pagination from '@/Components/Pagination';
import SelectField from '@/Components/SelectField';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Home({ articles, links, categories = [], authors = [], filters }) {
    const { data, setData, get, reset } = useForm({
        q: filters.q || '',
        date: filters.date || '',
        category: filters.category || '',
        author: filters.author || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('home'), { preserveState: true });
    };

    const handleReset = () => {
        reset({
            q: '',
            date: '',
            category: '',
            author: '',
        });
        router.get(route('home')); // This removes all query parameters
    };

    return (
        <>
            <Head title="Home" />
            <DefaultLayout>
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h4">Latest News</h1>
                    </div>

                    <div className="mb-4">
                        <form className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 align-items-end" onSubmit={handleSubmit}>
                            <div className="col">
                                <InputLabel htmlFor="q">Search</InputLabel>
                                <TextInput
                                    type="text"
                                    id="q"
                                    placeholder="Search by keyword"
                                    className="form-control"
                                    value={data.q}
                                    onChange={(e) => setData('q', e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <InputLabel htmlFor="date">Publish Date</InputLabel>
                                <TextInput
                                    type="date"
                                    id="date"
                                    className="form-control"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <SelectField
                                    id="category"
                                    label="Category"
                                    options={categories}
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <SelectField
                                    id="author"
                                    label="Author"
                                    options={authors}
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-3 col-lg-2 d-flex">
                                <button type="submit" className="btn btn-primary w-100 me-2">Search</button>
                                <button type="button" className="btn btn-secondary w-100" onClick={handleReset}>Reset</button>
                            </div>
                        </form>
                    </div>

                    <div className="row gy-4">
                        {articles.map((article) => (
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
                        ))}
                    </div>

                    <Pagination links={links} />
                </div>
            </DefaultLayout>
        </>
    );
}
