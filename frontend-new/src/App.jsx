import './App.css'
import { Routes, Route } from 'react-router-dom';
import Frontpage from './page/frontpage';
import Login from './page/login';
import Register from './page/register';
import Dashboard from './page/dashboard';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App