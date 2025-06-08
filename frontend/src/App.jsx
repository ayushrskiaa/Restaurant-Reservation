import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./Pages/Home/Home";
import NotFound from './Pages/NotFound/NotFound';
import CheckoutPage from "./components/checkOut";
import Success from './Pages/Success/Success';
import RestaurantDashboard from "./components/ClientSideComponents/RestaurantDashboard";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkOut" element={<CheckoutPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
