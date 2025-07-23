import { Routes, Route } from 'react-router-dom';
import FrontPage from '../Pages/FrontPage';
import Stations from '../Pages/Stations';
import Home from '../Pages/Home';
import Contact from '../Pages/Contact';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default AppRoutes