import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Topics from './pages/Topics'
import Questions from './pages/Questions'
import Stats from './pages/Stats'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/topics" element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } />
        <Route path="/questions/:topico" element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        } />
        <Route path="/stats" element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App