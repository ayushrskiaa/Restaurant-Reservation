import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import CheckoutPage from "./components/checkOut";
import Success from './Pages/Success/Success';
import './App.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/checkOut',
      element: <CheckoutPage />,
    },
    {
      path: '/success',
      element: <Success />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true, // Enables React's startTransition API
      v7_relativeSplatPath: true, // Enables relative splat path resolution
    },
  }
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
