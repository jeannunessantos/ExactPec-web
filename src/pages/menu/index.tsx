import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import {FiHome } from 'react-icons/fi';
import {GiCow, GiFarmer } from 'react-icons/gi';
import {MdDashboardCustomize, MdOutlineBatchPrediction } from 'react-icons/md';
import {GoOrganization } from 'react-icons/go';
import {TbChartAreaLine } from 'react-icons/tb';



import {AuthContext} from '../../contexts/AuthContext'
import {useContext} from 'react'

function Menu() {
    const { signed, loadingAuth } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
  return (
    <>
    {!loadingAuth && signed &&(
      <nav 
      className={`${
          menuOpen
            ? 'w-2/12 transition-all duration-500 ease-in-out'
            : 'w-0 overflow-hidden transition-all duration-500 ease-in-out '
        } flex-col bg-blue-500 p-6`}
      >
          <ul className={` ${menuOpen ? 'space-y-2 flex flex-col' : 'space-y-2 flex flex-col justify-center items-center' }`}>
              <FaBars size='20' className={`${menuOpen ? 'text-white text-2xl cursor-pointer ml-auto': 'text-white text-2xl cursor-pointer'}`} onClick={toggleMenu} />
              <li>
                <Link to='/' className="text-white flex items-center"> {menuOpen ? (<><FiHome size='20'/>  <span className="ml-2">Início</span></>) : (<FiHome size='20'/>)} </Link>
              </li>
              <li>
                <Link to='/dashboard' className="text-white flex items-center"> {menuOpen ? (<><MdDashboardCustomize size='20'/>  <span className="ml-2">Dashboard</span></>) : (<MdDashboardCustomize size='20'/>)} </Link>
              </li>
              <li>
                <Link to='/pesquisa/fazenda' className="text-white flex items-center"> {menuOpen ? (<><GiFarmer size='20'/> <span className="ml-2">Propriedade</span></>) : (<GiFarmer size='20'/>)} </Link>
              </li>
              <li>
                <Link to='/pesquisa/animal' className="text-white flex items-center">{menuOpen ? (<><GiCow size='20'/> <span className="ml-2">Animais</span></>) : (<GiCow size='20'/>)}</Link>
              </li>
              <li>
                <Link to='/pesquisa/raca' className="text-white flex items-center"> {menuOpen ? (<><GiCow size='20'/> <span className="ml-2">Raça</span></>) : (<GiCow size='20'/>)}</Link>
              </li>
              <li>
                <Link to='/pesquisa/empresa' className="text-white flex items-center"> {menuOpen ? (<><GoOrganization size='20'/> <span className="ml-2">Empresa</span></>) : (<GoOrganization size='20'/>)} </Link>
              </li>
              <li>
                <Link to='/pesquisa/area' className="text-white flex items-center"> {menuOpen ? (<><TbChartAreaLine size='20'/> <span className="ml-2">Área</span></>) : (<TbChartAreaLine size='20'/>)} </Link>
              </li>
              <li>
                <Link to='/pesquisa/lote' className="text-white flex items-center"> {menuOpen ? (<><MdOutlineBatchPrediction size='20'/> <span className="ml-2">Lote</span></>) : (<MdOutlineBatchPrediction size='20'/>)} </Link>
              </li>
          </ul>
      </nav>
    )} 
    </>
  )
}

export default Menu;