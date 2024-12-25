import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="text-center mb-4">
                            <Link href={route('home')}>
                                <img
                                    src="https://placehold.co/300x100"
                                    alt="Logo"
                                    className="img-fluid"
                                    style={{ maxWidth: '150px' }}
                                />
                            </Link>
                        </div>

                        <div className="col-sm-8 col-md-5">
                            <div className="card p-4 shadow-sm">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
