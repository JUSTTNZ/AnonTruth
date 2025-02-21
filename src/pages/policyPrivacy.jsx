import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-[#00CCFF] mb-6">Privacy Policy</h1>
            <p className="text-lg mb-4">Your privacy is important to us. Here's how we handle your data:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>We do not collect personal data beyond what's necessary.</li>
                <li>Your messages are anonymous and not stored permanently.</li>
                <li>We do not share your data with third parties.</li>
                <li>You have the right to delete your data anytime.</li>
            </ul>
            <Link to="/login" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300">
                Back to Home
            </Link>
        </div>
    );
};
