import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import CheckoutPage from "./components/checkOut"; // Corrected path
import Success from './Pages/Success/Success';
import './App.css';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/checkOut" element={<CheckoutPage />} />
          <Route path='/success' element={<Success />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
};

export default App;
