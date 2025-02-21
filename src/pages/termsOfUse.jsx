import { Link } from 'react-router-dom';

export const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-[#00CCFF] mb-6">Terms of Use</h1>
            <p className="text-lg mb-4">Welcome to Akanite Box. By using our platform, you agree to the following terms:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>You must be at least 18 years old to use this service.</li>
                <li>Do not share harmful, abusive, or illegal content.</li>
                <li>We reserve the right to suspend accounts violating these terms.</li>
                <li>Your use of Akanite Box is at your own risk.</li>
            </ul>
            <Link to="/login" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300">
                Back to Home
            </Link>
        </div>
    );
};
