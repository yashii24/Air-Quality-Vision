import { Routes, Route } from 'react-router-dom';
import FrontPage from '../Pages/FrontPage';
import StationDirectory from '../Pages/StationDirectory';
import Home from '../Pages/Home';
import Contact from '../Pages/Contact';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/StationDirectory" element={<StationDirectory />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default AppRoutes