import { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import DefaultLayout from '@/Layouts/DefaultLayout';
import SelectField from '@/Components/SelectField';
import Posts from '@/Components/Posts';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function MyFeed({ articles, links, categories = [], authors = [], sources = [], filters }) {
    const { data, setData, get, reset } = useForm({
        q: filters.q || '',
        date: filters.date || '',
        category: filters.category || '',
        source: filters.source || '',
        author: filters.author || '',
    });

    const [isSearchFormOpen, setIsSearchFormOpen] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('isSearchFormOpen');

        if (savedState !== null) {
            setIsSearchFormOpen(savedState);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('isSearchFormOpen', isSearchFormOpen);
    }, [isSearchFormOpen]);

    const handleToggleSearchForm = () => {
        setIsSearchFormOpen(!isSearchFormOpen);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('myfeed'), { preserveState: true });
    };

    const handleReset = () => {
        reset({
            q: '',
            date: '',
            category: '',
            source: '',
            author: '',
        });
        router.get(route('myfeed')); // This removes all query parameters
    };

    return (
        <>
            <Head title="My Feed" />
            <DefaultLayout>
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h4">Latest News</h1>
                        <button className="btn btn-outline-primary d-lg-none" type="button" onClick={handleToggleSearchForm}>
                            Search
                        </button>
                    </div>

                    <div className={`collapse ${isSearchFormOpen ? 'show' : ''} d-lg-block mb-4`} id="searchForm">
                        <form className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 align-items-end" onSubmit={handleSubmit}>
                            <div className="col-md-6 col-lg-6">
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
                                    id="source"
                                    label="Source"
                                    options={sources}
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
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

                    <Posts articles={articles} links={links} />

                </div>
            </DefaultLayout>
        </>
    );
}
