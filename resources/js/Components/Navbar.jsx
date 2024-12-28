import { Link, usePage } from "@inertiajs/react";

export default function Navbar() {

    const { props: { auth } } = usePage();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand" href={route('home')}>News Aggregator</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarContent">
                        {auth && auth.user ? (
                            <>

                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <Link className={`nav-link ${route().current('myfeed.index') ? 'active' : ''}`} href={route('myfeed.index')}>My Feed</Link>
                                    </li>
                                </ul>
                                <div className="dropdown">
                                    <a href="#" className="d-block text-decoration-none text-white dropdown-toggle" id="profileDropdown"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="https://placehold.co/40" alt="Profile" className="rounded-circle" />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                        <li><Link className="dropdown-item" href={route('profile.edit')}>Profile</Link></li>
                                        <li><Link className="dropdown-item" href={route('preferences.index')}>Preferences</Link></li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link href={route('logout')} method="post" as="button" className="dropdown-item" >Logout</Link>
                                        </li>
                                    </ul>
                                </div>

                            </>
                        ) : (
                            <>
                                <div className="ms-auto">
                                    <Link href={route('login')} className="btn btn-outline-light me-2">Login</Link>
                                    <Link href={route('register')} className="btn btn-light">Register</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )

};
