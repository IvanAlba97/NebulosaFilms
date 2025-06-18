import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MovieDetail from './pages/MovieDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
  );
}
