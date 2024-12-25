import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, router } from '@inertiajs/react';



export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), data, {
            onFinish: () => reset('password')
        });
    };

    return (
        <>
            <Head title="Login" />

            <GuestLayout>
                <h2 className="text-center text-primary mb-4">Login</h2>

                {status && (
                    <>
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {status}
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
                    <div className="mb-3">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    {canResetPassword && (
                        <>
                            <div className="text-end mb-3">
                                <Link href={route('password.request')} className="text-primary small">Forgot Password?</Link>
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-primary w-100" disabled={processing}>Login</button>
                </form>

                <div className="text-center mt-3">
                    <p className="mb-0">Don't have an account? <Link href={route('register')} className="text-primary">Register</Link></p>
                </div>
            </GuestLayout>
        </>
    );
};