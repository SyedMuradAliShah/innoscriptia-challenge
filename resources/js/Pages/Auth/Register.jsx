import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, router } from '@inertiajs/react';



export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), data, {
            onFinish: () => reset('password', 'password_confirmation')
        });
    };

    return (
        <>
            <Head title="Register" />
            <GuestLayout>
                <h2 className="text-center text-primary mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <InputLabel htmlFor="name">Full Name</InputLabel>
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className="form-control"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <InputLabel htmlFor="email">Email address</InputLabel>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="form-control"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            
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
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0">Already have an account? <Link href={route('login')} className="text-primary">Login</Link></p>
                </div>
            </GuestLayout>
        </>
    );
};