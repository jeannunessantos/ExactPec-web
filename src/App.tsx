import {createBrowserRouter} from 'react-router-dom'
import {Home} from './pages/home'
import {Login} from './pages/login'
import {Dashboard} from './pages/dashboard'
import {CadastroAnimais} from './pages/cadastro/animais/new'
import {DetalheAnimais} from './pages/cadastro/animais/detail'
import {Layout} from './components/layout'
import { New } from './pages/dashboard/new'
import { Register } from './pages/register'
import { PesquisarAnimais } from './pages/cadastro/animais'
import { Private } from './routes/Private'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/pesquisa/animal",
        element: <Private><PesquisarAnimais/></Private>
      },
      {
        path:"/cadastro/animal/:id?",
        element: <Private><CadastroAnimais/></Private>
      },
      {
        path:"/detalhe/animal/:id",
        element: <Private><DetalheAnimais/></Private>
      },
      {
        path:"/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path:"/dashboard/new",
        element: <Private><New/></Private>
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