import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/welcomePage'
import Login from './auth/login'
import Register from './auth/register'
import Chats from './pages/chats'
function App() {


  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Chats />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
