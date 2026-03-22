import './App.css';
import './Navbar.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Number from './pages/Number';
import Products, { CarProducts, BikeProducts } from './pages/Products';
import Info from './pages/Info';
import WordGame from './pages/WordGame';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/" className="logo-link">MyApp</NavLink>
        </div>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            About
          </NavLink>
          <NavLink 
            to="/number" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Number
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Products
          </NavLink>
          <NavLink 
            to="/customer/stian" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Stian
          </NavLink>
          <NavLink 
            to="/WordGame" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            WordGame
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/number" element={<Number />} />
        <Route path="/products" element={<Products />}>
          <Route path="car" element={<CarProducts />} />
          <Route path="bike" element={<BikeProducts />} />
        </Route>
        <Route path="/customer/:firstname" element={<Info />} />
        <Route path="/WordGame" element={<WordGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
