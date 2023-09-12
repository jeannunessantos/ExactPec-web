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
import { DetalheFazenda } from './pages/cadastro/fazenda/detail'
import { CadastroFazenda } from './pages/cadastro/fazenda/new'
import { PesquisarFazenda } from './pages/cadastro/fazenda'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path:"/dashboard/new",
        element: <Private><New/></Private>
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
        path:"/pesquisa/fazenda",
        element: <Private><PesquisarFazenda/></Private>
      },
      {
        path:"/cadastro/fazenda/:id?",
        element: <Private><CadastroFazenda/></Private>
      },
      {
        path:"/detalhe/fazenda/:id",
        element: <Private><DetalheFazenda/></Private>
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