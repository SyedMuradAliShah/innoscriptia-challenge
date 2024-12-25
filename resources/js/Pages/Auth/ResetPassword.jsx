import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, router } from '@inertiajs/react';



export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <GuestLayout>
                <h2 className="text-center text-primary mb-4">Reset Password</h2>

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
                            placeholder="Enter new password"
                            className="form-control"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}

                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <InputLabel htmlFor="password_confirmation">Confirm Password</InputLabel>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            placeholder="Enter new password again"
                            className="form-control"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}

                        />
                        {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={processing}>Login</button>
                </form>

                <div className="text-center mt-3">
                    <p className="mb-0">Don't have an account? <Link href={route('register')} className="text-primary">Register</Link></p>
                </div>
            </GuestLayout>
        </>
    );
};