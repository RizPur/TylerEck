import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TributePage from './pages/TributePage.jsx';
import GamePage from './pages/GamePage.jsx';
import WinPage from './pages/WinPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TributePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/win" element={<WinPage />} />
      </Routes>
    </BrowserRouter>
  );
}
