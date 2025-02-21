import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/welcomePage';
import Login from './auth/login';
import Register from './auth/register';
import Chat from './pages/chat';
import { TermsOfUse } from './pages/termsOfUse';
import { PrivacyPolicy } from './pages/policyPrivacy';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
