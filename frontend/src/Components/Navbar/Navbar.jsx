import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/New_logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { IoIosArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalCartItems } = useContext(ShopContext); // Assuming these are provided by ShopContext
  const menuRef = useRef();
  const navigate = useNavigate();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='logo' />
        <p>JERSEY BLITZ</p>
      </div>
      <IoIosArrowDropdown className='nav-dropdown' onClick={dropdown_toggle} />
      <div className="search">
        <form onSubmit={handleSearch}>
          <input
            type='search'
            placeholder='Search Products'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      <ul className='nav-menu' ref={menuRef}>
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none' }} to='/'>SHOP</Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("homekit")}>
          <Link style={{ textDecoration: 'none' }} to='/homekits'>HOME KIT</Link>
          {menu === "homekit" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("awaykit")}>
          <Link style={{ textDecoration: 'none' }} to='/awaykits'>AWAY KIT</Link>
          {menu === "awaykit" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("clasickit")}>
          <Link style={{ textDecoration: 'none' }} to='/clasickits'>CLASSIC KIT</Link>
          {menu === "clasickit" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ?
          <button
            className='login-button'
            onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/login'); }}
          >
            Logout
          </button>
          :
          <Link to="/login"><button className='login-button'>Login</button></Link>
        }
        <Link to='/cart'><img src={cart_icon} alt='cart' /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
