import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    const firstPage = links[1];
    const lastPage = links[links.length - 2];
    const previousPage = links.find(link => link.label === '&laquo; Previous');
    const nextPage = links.find(link => link.label === 'Next &raquo;');
    const currentPage = links.find(link => link.active);

    return (
        <nav aria-label="Page navigation example" className="my-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${previousPage.url === null ? 'disabled' : ''}`}>
                    <Link className="page-link" href={firstPage.url || '#'}>« First</Link>
                </li>
                <li className={`page-item ${previousPage.url === null ? 'disabled' : ''}`}>
                    <Link className="page-link" href={previousPage.url || '#'}>‹ Previous</Link>
                </li>
                <li className="page-item active">
                    <span className="page-link">{currentPage.label}</span>
                </li>
                <li className={`page-item ${nextPage.url === null ? 'disabled' : ''}`}>
                    <Link className="page-link" href={nextPage.url || '#'}>Next ›</Link>
                </li>
                <li className={`page-item ${nextPage.url === null ? 'disabled' : ''}`}>
                    <Link className="page-link" href={lastPage.url || '#'}>Last »</Link>
                </li>
            </ul>
        </nav>
    );
}
