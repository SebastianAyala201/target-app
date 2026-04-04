import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Topics from './pages/Topics'
import Questions from './pages/Questions'
import Stats from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/questions/:topico" element={<Questions />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App