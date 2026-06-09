import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Topics from './pages/Topics'
import SubTopics from './pages/SubTopics'
import Questions from './pages/Questions'
import Stats from './pages/Stats'
import ProtectedRoute from './components/ProtectedRoute'
import AutorizadoRoute from './components/AutorizadoRoute'
import Terminos from './pages/Terminos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/topics" element={
          <AutorizadoRoute>
            <Topics />
          </AutorizadoRoute>
        } />
        <Route path="/subtopics/:area" element={
          <AutorizadoRoute>
            <SubTopics />
          </AutorizadoRoute>
        } />
        <Route path="/questions/:topico" element={
          <AutorizadoRoute>
            <Questions />
          </AutorizadoRoute>
        } />
        <Route path="/stats" element={
          <AutorizadoRoute>
            <Stats />
          </AutorizadoRoute>
        } />
        <Route path="/terminos" element={<Terminos />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App