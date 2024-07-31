// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowList from './components/ShowList';
import ShowDetail from './components/ShowDetail';
import Favorites from './components/favorites'; // Import Favorites component
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShowList />} />
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/favorites" element={<Favorites />} /> {/* Route for Favorites */}
      </Routes>
    </Router>
  );
};

export default App;





