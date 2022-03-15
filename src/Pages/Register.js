import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'
import { useForm } from '../util/CustomHooks'
import { AuthContext } from '../Context/auth'

const REGISTER_USER = gql`
  mutation register($registerInput: RegisterInput) {
    register(registerInput: $registerInput) {
      createdAt
      email
      id
      token
      username
    }
  }
`

function Register() {
  const history = useNavigate()

  const { login } = useContext(AuthContext)

  const intialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const [errors, setErrors] = useState({})

  const [addNewUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      history('/')
      login(userData)
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.errors)
    },
  })

  const { values, submitForm, onChange } = useForm(callBack, intialValues)

  function callBack() {
    addNewUser({ variables: { registerInput: values } })
  }

  return (
    <div className='container'>
      <Form onSubmit={submitForm} className={loading ? 'loading' : ''}>
        <div className='title'>
          <h1>Register</h1>
        </div>
        <Form.Input
          label='Username'
          placeholder='Username'
          type='text'
          name='username'
          values={values.username}
          onChange={onChange}
          autoComplete='off'
          error={errors.username ? true : false}
        />
        <Form.Input
          label='Email'
          placeholder='Email'
          type='text'
          name='email'
          values={values.email}
          onChange={onChange}
          autoComplete='off'
          error={errors.email ? true : false}
        />
        <Form.Input
          label='Password'
          placeholder='Password'
          type='password'
          name='password'
          values={values.password}
          onChange={onChange}
          autoComplete='off'
          error={errors.password ? true : false}
        />
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password'
          type='password'
          name='confirmPassword'
          values={values.confirmPassword}
          onChange={onChange}
          autoComplete='off'
          error={errors.password ? true : false}
        />
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Register
