import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
})

let intialValue = {
  user: null,
}

if (localStorage.getItem('jwtToken')) {
  const decodedData = jwtDecode(localStorage.getItem('jwtToken'))
  if (decodedData.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken')
  } else {
    intialValue.user = decodedData
  }
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, intialValue)

  const login = (userData) => {
    localStorage.setItem('jwtToken', userData.token)
    dispatch({
      type: 'LOGIN',
      payload: userData,
    })
  }

  const logout = () => {
    localStorage.removeItem('jwtToken')
    dispatch({
      type: 'LOGOUT',
    })
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  )
}

export { AuthProvider, AuthContext }
