import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="fs-5 fw-bold">
                    Update Password
                </h2>

                <p className="mt-1 small">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 g-3">
                <div className='mb-3'>
                    <InputLabel htmlFor="current_password">Current Password</InputLabel>
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        placeholder="Enter your current password"
                        className="form-control"
                        value={data.current_password}  // Fixed from data.password
                        onChange={(e) => setData('current_password', e.target.value)}
                        required
                    />
                    {errors.current_password && <div className="text-danger">{errors.current_password}</div>}
                </div>

                <div className='mb-3'>
                    <InputLabel htmlFor="password">New Password</InputLabel>
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        type="password"
                        placeholder="Enter your new password"
                        className="form-control"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation">Confirm Password</InputLabel>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        placeholder="Confirm your new password"
                        className="form-control"
                        value={data.password_confirmation}  // Fixed from data.password
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}
                </div>

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
