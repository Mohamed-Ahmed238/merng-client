import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'
import { useForm } from '../util/CustomHooks'
import { AuthContext } from '../Context/auth'

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      createdAt
      email
      id
      token
      username
    }
  }
`

function Login() {
  const history = useNavigate()

  const { login } = useContext(AuthContext)

  const intialValues = {
    username: '',
    password: '',
  }

  const [errors, setErrors] = useState({})

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      history('/')
      login(userData)
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.errors)
    },
  })

  const { values, onChange, submitForm } = useForm(callBack, intialValues)

  function callBack() {
    loginUser({ variables: values })
  }

  return (
    <div className='container' id='login'>
      <Form onSubmit={submitForm} className={loading ? 'loading' : ''}>
        <div className='title'>
          <h1>Login</h1>
        </div>
        <Form.Input
          label='Username'
          type='text'
          placeholder='Username'
          name='username'
          autoComplete='off'
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label='Password'
          type='password'
          placeholder='Password'
          name='password'
          autoComplete='off'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Button type='submit' primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Login
