import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/welcomePage'
import Login from './auth/login'
function App() {


  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
