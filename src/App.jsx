import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import { Welcome } from "./pages/welcomePage";
import Login from "./auth/login";
import Register from "./auth/register";
import Chat from "./pages/chat";
import { TermsOfUse } from "./pages/termsOfUse";
import { PrivacyPolicy } from "./pages/policyPrivacy";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMessageAllowed, setIsMessageAllowed] = useState(true);

  useEffect(() => {
    const storedAdminStatus = localStorage.getItem("isAdmin") === "true"; // Ensure it's a boolean
    setIsAdmin(storedAdminStatus);
  }, []);
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat isAdmin={isAdmin} isMessageAllowed={isMessageAllowed} setIsMessageAllowed={setIsMessageAllowed} />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
