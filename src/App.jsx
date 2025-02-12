import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/welcomePage'
function App() {


  return (
    <div className="bg-deepBlue text-electricTeal min-h-screen font-sans">
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
