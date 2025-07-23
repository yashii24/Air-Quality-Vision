import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function App() {
  const sampleAQI = 72;
  return (
    <Router>
      <Navbar/>
      <AppRoutes />
      <Footer/>
    </Router>
  );
}
export default App;

