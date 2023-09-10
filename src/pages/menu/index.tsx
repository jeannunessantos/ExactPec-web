import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {FiHome } from 'react-icons/fi';
import {GiCow, GiFarmer } from 'react-icons/gi';


function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
  return (
    <nav 
    className={`${
        menuOpen
          ? 'w-2/12 transition-all duration-500 ease-in-out'
          : 'w-0 overflow-hidden transition-all duration-500 ease-in-out'
      } flex-col bg-blue-500 h-full p-6`}
    >
        <ul className={` ${menuOpen ? 'space-y-2 flex flex-col' : 'space-y-2 flex flex-col justify-center items-center' }`}>
            <FaBars size='20' className={`${menuOpen ? 'text-white text-2xl cursor-pointer ml-auto': 'text-white text-2xl cursor-pointer'}`} onClick={toggleMenu} />
            <li><a href="#" className="text-white block">{menuOpen ? "Página Inicial" : <FiHome size='20'/>}</a></li>
            <li><a href="#" className="text-white block">{menuOpen ? "Animais" : <GiCow size='20'/>}</a></li>
            <li><a href="#" className="text-white block">{menuOpen ? "Propriedade" : <GiFarmer size='20'/>}</a></li>
        </ul>
    </nav>
  );
}

export default Menu;