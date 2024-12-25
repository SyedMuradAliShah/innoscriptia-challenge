import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Profile" />
            <DefaultLayout>
                <div className="col-sm-8 col-md-5 mx-auto mt-5">
                    <div className="py-12">
                        <div className="mx-auto">
                            <div className="bg-white p-4 shadow">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            <div className="bg-white p-4 shadow">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}
