import {createBrowserRouter} from 'react-router-dom'
import {Home} from './pages/home'
import {Login} from './pages/login'
import {Dashboard} from './pages/dashboard'
import {CadastroAnimais} from './pages/cadastro/animais/new'
import {DetalheAnimais} from './pages/cadastro/animais/detail'
import {Layout} from './components/layout'
import { New } from './pages/dashboard/new'
import { Register } from './pages/register'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/animal",
        element: <CadastroAnimais/>
      },
      {
        path:"/animal/:id",
        element: <DetalheAnimais/>
      },
      {
        path:"/dashboard",
        element: <Dashboard/>
      },
      {
        path:"/dashboard/new",
        element: <New/>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  }
])

export {router}