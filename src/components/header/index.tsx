import {useContext} from 'react'
import {AuthContext} from '../../contexts/AuthContext'
import logoImg from '../../assets/logo.svg'
import {Link} from 'react-router-dom'
import {FiUser, FiLogIn} from 'react-icons/fi'

export function Header(){
const { signed, loadingAuth } = useContext(AuthContext);



    return(
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow md-4'>
            <header className='flex w-full items-center justify-between px-4 mx-auto'>
                <Link to="/">
                    <img
                        src={logoImg}
                        alt='Logo do site'
                    />
                </Link>
                {!loadingAuth && signed &&(
                    <Link to="/dashboard">
                        <div className='border-2 rounded-full p-1 border-gray-900'>
                            <FiUser sixe={24} color='#000'/>
                        </div>
                </Link>
                )}
                {!loadingAuth && !signed &&(
                    <Link to="/login">
                        <div className='border-2 rounded-full p-1 border-gray-900'>
                            <FiLogIn sixe={24} color='#000'/>
                        </div>
                </Link>
                )}
            </header>
        </div>
    )
}