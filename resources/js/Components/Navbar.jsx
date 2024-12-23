import { Link } from "@inertiajs/react";

export default function Navbar() {

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
                        <div className="ms-auto">
                            <a href="./login.html" className="btn btn-outline-light me-2">Login</a>
                            <a href="./register.html" className="btn btn-light">Register</a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )

};
