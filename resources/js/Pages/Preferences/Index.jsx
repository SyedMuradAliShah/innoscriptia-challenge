import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DefaultLayout from '@/Layouts/DefaultLayout';
import SelectField from '@/Components/SelectField';

export default function Preference({ userPreferences, sources, categories, authors }) {
    const [message, setMessage] = useState('');
    
    const sourceForm = useForm({ preference: '' });
    const categoryForm = useForm({ preference: '' });
    const authorForm = useForm({ preference: '' });

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddSource = () => {
        if (!sourceForm.data.preference) return;
        sourceForm.post(route('preferences.store', 'source'), {
            preserveState: true,
            onSuccess: () => {
                sourceForm.reset();
                showMessage('Source added successfully');
            },
        });
    };

    const handleAddCategory = () => {
        if (!categoryForm.data.preference) return;
        categoryForm.post(route('preferences.store', 'category'), {
            preserveState: true,
            onSuccess: () => {
                categoryForm.reset();
                showMessage('Category added successfully');
            },
        });
    };

    const handleAddAuthor = () => {
        if (!authorForm.data.preference) return;
        authorForm.post(route('preferences.store', 'author'), {
            preserveState: true,
            onSuccess: () => {
                authorForm.reset();
                showMessage('Author added successfully');
            },
        });
    };

    const handleRemove = (type, preference) => {
        router.delete(route('preferences.destroy', type), {
            data: { preference },
            preserveState: true,
            onSuccess: () => {
                showMessage(`${type.slice(0, -1)} removed successfully`);
            },
        });
    };

    return (
        <>
            <Head title="My Preferences" />
            <DefaultLayout>
                <div className="container py-4">
                    {message && (
                        <div className="alert alert-success">{message}</div>
                    )}
                    <h1 className="h4 mb-4">Customize Your News Feed</h1>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mt-4">Add New Preferences</h5>
                            <div className="row">
                                <div className="col-md-4">
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddSource(); }}>
                                        <div className="mb-3">
                                            <SelectField
                                                id="preferredSources"
                                                label="Preferred Sources"
                                                options={sources}
                                                value={sourceForm.data.preference}
                                                onChange={e => sourceForm.setData('preference', e.target.value)}
                                            />
                                            {sourceForm.errors.preference && (
                                                <div className="text-danger mt-1">{sourceForm.errors.preference}</div>
                                            )}
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-sm mt-2"
                                                disabled={!sourceForm.data.preference}
                                            >
                                                Add Source
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4">
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                                        <div className="mb-3">
                                            <SelectField
                                                id="preferredCategories"
                                                label="Preferred Categories"
                                                options={categories}
                                                value={categoryForm.data.preference}
                                                onChange={e => categoryForm.setData('preference', e.target.value)}
                                            />
                                            {categoryForm.errors.preference && (
                                                <div className="text-danger mt-1">{categoryForm.errors.preference}</div>
                                            )}
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-sm mt-2"
                                                disabled={!categoryForm.data.preference}
                                            >
                                                Add Category
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4">
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddAuthor(); }}>
                                        <div className="mb-3">
                                            <SelectField
                                                id="preferredAuthors"
                                                label="Preferred Authors"
                                                options={authors}
                                                value={authorForm.data.preference}
                                                onChange={e => authorForm.setData('preference', e.target.value)}
                                            />
                                            {authorForm.errors.preference && (
                                                <div className="text-danger mt-1">{authorForm.errors.preference}</div>
                                            )}
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-sm mt-2"
                                                disabled={!authorForm.data.preference}
                                            >
                                                Add Author
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <h5 className="card-title">Your Preferences</h5>
                            <div>
                                <ul className="list-group mb-3" id="preferencesList">
                                    {userPreferences.sources && userPreferences.sources.map((source) => (
                                        <li key={`source-${source}`} className="list-group-item d-flex justify-content-between align-items-center">
                                            {source} (Source)
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemove('source', source)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                    {userPreferences.categories && userPreferences.categories.map((category) => (
                                        <li key={`category-${category}`} className="list-group-item d-flex justify-content-between align-items-center">
                                            {category} (Category)
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemove('category', category)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                    {userPreferences.authors && userPreferences.authors.map((author) => (
                                        <li key={`author-${author}`} className="list-group-item d-flex justify-content-between align-items-center">
                                            {author} (Author)
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemove('author', author)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                    {(!userPreferences.sources?.length && 
                                      !userPreferences.categories?.length && 
                                      !userPreferences.authors?.length) && (
                                        <li className="list-group-item text-center text-muted">
                                            No preferences set
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout >
        </>
    );

};

