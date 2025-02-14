import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/welcomePage'
import Login from './auth/login'
import Register from './auth/register'
<<<<<<< HEAD
import Chats from './pages/chats'
=======
import Chat from './pages/chat'
>>>>>>> b7afe84265db8c380b889f0f438288f2734d6545
function App() {


  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
<<<<<<< HEAD
                <Route path="*" element={<Chats />} />
=======
                <Route path="/chat" element={<Chat />} />
>>>>>>> b7afe84265db8c380b889f0f438288f2734d6545
            </Routes>
        </Router>
    </div>
  )
}

export default App
