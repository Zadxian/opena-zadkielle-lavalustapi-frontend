import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Products from './Products';

function Protected({ children }) {
  return localStorage.getItem('access_token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Protected><Products /></Protected>} />
        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </BrowserRouter>
  );
}