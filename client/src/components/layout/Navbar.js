import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <li className='navbar bg-dark'>
      <Link to='/'>
        <i className='fas fa-code' /> Job Hunter
      </Link>
      <ul>
        <li>
          <Link to='/job'>Jobs</Link>
        </li>
        <li>
          <Link to='/contact'>Contacts</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </li>
  );
};

export default Navbar;
