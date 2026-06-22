import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Areas from './pages/Areas'
import Topicos from './pages/Topicos'
import Questions from './pages/Questions'
import Stats from './pages/Stats'
import AutorizadoRoute from './components/AutorizadoRoute'
import Terminos from './pages/Terminos'
import Dashboard from './pages/Dashboard'
import QuestionInspector from './pages/QuestionInspector'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/areas" element={
          <AutorizadoRoute>
            <Areas />
          </AutorizadoRoute>
        } />
        <Route path="/topicos/:area" element={
          <AutorizadoRoute>
            <Topicos />
          </AutorizadoRoute>
        } />
        <Route path="/preguntas/:topico" element={
          <AutorizadoRoute>
            <Questions />
          </AutorizadoRoute>
        } />
        <Route path="/stats" element={
          <AutorizadoRoute>
            <Stats />
          </AutorizadoRoute>
        } />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/inspector" element={<QuestionInspector />} />
        <Route path="/dashboard" element={
          <AutorizadoRoute>
            <Dashboard />
          </AutorizadoRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App