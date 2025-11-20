import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Admin from './pages/Admin';

// Wrapper to hide Navbar on Admin pages for cleaner workspace
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && (
        <footer className="bg-stone-900 text-stone-400 py-12 text-center">
          <p className="font-serif text-sm">© 2025 RoyalCrown Luxury Bridal. All Rights Reserved.</p>
          <p className="text-xs mt-2 opacity-50">Private Order Only</p>
        </footer>
      )}
    </>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </ShopProvider>
  );
}

export default App;