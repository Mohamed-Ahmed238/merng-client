import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import './App.css'
import { Container } from 'semantic-ui-react'

import MenuBar from './Component/MenuBar'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import SinglePost from './Pages/SinglePost'
import { useContext } from 'react'
import { AuthContext } from './Context/auth'

function App() {
  const { user } = useContext(AuthContext)
  return (
    <Container>
      <Router>
        <MenuBar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route
            exact
            path='/login'
            element={user ? <Navigate replace to='/' /> : <Login />}
          />
          <Route
            exact
            path='/register'
            element={user ? <Navigate replace to='/' /> : <Register />}
          />
          <Route exact path='/posts/:postId' element={<SinglePost />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
