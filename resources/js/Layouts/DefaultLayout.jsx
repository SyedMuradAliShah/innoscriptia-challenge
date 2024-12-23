import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function DefaultLayout({ children }) {
    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar />

            {children}

            <Footer />
        </div>
    );
};
