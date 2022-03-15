import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client'
import { AuthProvider } from './Context/auth'

const httpLink = new HttpLink({ uri: 'http://localhost:3001/' })

const authLink = new ApolloLink((operations, forward) => {
  const token = localStorage.getItem('jwtToken')
  operations.setContext(({ headers = {} }) => ({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  }))
  return forward(operations)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authLink, httpLink),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
