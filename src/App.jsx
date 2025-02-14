import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/welcomePage'
import Login from './auth/login'
import Register from './auth/register'
import Chat from './pages/chat'
function App() {


  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
