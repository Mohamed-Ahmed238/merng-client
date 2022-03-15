import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../util/CustomHooks'
import { gql, useMutation } from '@apollo/client'
import { GET_ALL_POSTS } from '../util/get_posts_graphql'

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      body
      createdAt
      id
      username
      likesCount
      commentsCount
      likes {
        createdAt
        id
        username
      }
      comments {
        body
        createdAt
        id
        username
      }
    }
  }
`

function PostForm() {
  const { values, onChange, submitForm } = useForm(callBackFn, {
    body: '',
  })

  const [createPost, { error }] = useMutation(CREATE_POST, {
    update: (proxy, { data: { createPost: addedPost } }) => {
      const data = proxy.readQuery({
        query: GET_ALL_POSTS,
      })

      proxy.writeQuery({
        query: GET_ALL_POSTS,
        data: {
          getPosts: [addedPost, ...data.getPosts],
        },
      })
      document.querySelector('#text').value = ''
      values.body = ''
    },
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  function callBackFn() {
    createPost({ variables: values })
  }

  return (
    <>
      <Form onSubmit={submitForm}>
        <h2>Create a post : </h2>
        <Form.Field>
          <Form.Input
            placeholder='Hi World!'
            name='body'
            onChange={onChange}
            values={values.body}
            autoComplete='off'
            id='text'
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

export default PostForm
