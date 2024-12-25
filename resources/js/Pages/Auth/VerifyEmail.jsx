import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />
            <GuestLayout>
                <h2 className="text-center text-primary mb-4">Resend Verification Email</h2>

                {status === 'verification-link-sent' && (
                    <>
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            A new verification link has been sent to the email address
                            you provided during registration.
                            <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close"></button>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <InputLabel htmlFor="email">Email address</InputLabel>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="form-control"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={processing}>Resend Verification Email</button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0">
                        <Link href={route('logout')} method="post" as="button" className="btn btn-outline-light">Logout</Link>
                    </p>
                </div>

            </GuestLayout>
        </>
    );
}
