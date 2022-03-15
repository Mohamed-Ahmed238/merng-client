import React, { useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/auth'

function MenuBar() {
  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substr(1)

  const [activeItem, setActiveItem] = useState(path)

  const { user, logout } = useContext(AuthContext)

  return (
    <div>
      {user ? (
        <Menu pointing secondary size='massive' color='teal'>
          <Menu.Item name={user.username} active={true} as={Link} to='/' />

          <Menu.Menu position='right'>
            <Menu.Item name='Logout' onClick={() => logout()} />
          </Menu.Menu>
        </Menu>
      ) : (
        <Menu pointing secondary size='massive' color='teal'>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={() => setActiveItem('home')}
            as={Link}
            to='/'
          />

          <Menu.Menu position='right'>
            <Menu.Item
              name='Login'
              active={activeItem === 'login'}
              onClick={() => setActiveItem('login')}
              as={Link}
              to='/login'
            />
            <Menu.Item
              name='Register'
              active={activeItem === 'register'}
              onClick={() => setActiveItem('register')}
              as={Link}
              to='/register'
            />
          </Menu.Menu>
        </Menu>
      )}
    </div>
  )
}

export default MenuBar
