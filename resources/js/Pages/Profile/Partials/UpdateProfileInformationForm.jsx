import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="fs-5 fw-bold">
                    Profile Information
                </h2>

                <p className="mt-1 small">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className='mb-3'>
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

                <div className='mb-3'>
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

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-3 text-center">
                    <div className="d-flex">
                        <button type="submit" className="btn btn-primary w-25 mx-auto text-center" disabled={processing}>Save</button>
                    </div>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="small text-success">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
