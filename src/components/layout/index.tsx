import {Header} from '../header'
import {Outlet} from 'react-router-dom'
import Menu from '../../pages/menu'

export function Layout(){
    return(
        <>
            <div className='flex'>
                    <Menu/>
                <div className='flex-col w-full'>
                    <Header/>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}