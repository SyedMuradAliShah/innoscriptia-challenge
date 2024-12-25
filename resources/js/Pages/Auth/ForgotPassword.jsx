import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <GuestLayout>
                
            <h2 className="text-center text-primary mb-4">Forgot Password</h2>

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
                    <button type="submit" className="btn btn-primary w-100" disabled={processing}>Send Reset Link</button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0"><Link href={route('login')} className="text-primary">Back to Login</Link></p>
                </div>

            </GuestLayout>
        </>
    );
}
