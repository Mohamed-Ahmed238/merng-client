import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Card, Grid, Image, Button, CardContent, Form } from 'semantic-ui-react'
import moment from 'moment'

import LikeButton from '../Component/LikeButton'
import { AuthContext } from '../Context/auth'
import DeleteButton from '../Component/DeleteButton'

const GET_POST = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      body
      createdAt
      id
      username
      commentsCount
      comments {
        body
        createdAt
        id
        username
      }
      likesCount
      likes {
        createdAt
        id
        username
      }
    }
  }
`
const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      body
      createdAt
      id
      username
      commentsCount
      comments {
        body
        createdAt
        id
        username
      }
    }
  }
`
function SinglePost() {
  const { postId } = useParams()
  const history = useNavigate()

  const [comment, setComment] = useState('')

  const { data, error, loading } = useQuery(GET_POST, {
    variables: { postId },
  })

  const [createComment] = useMutation(CREATE_COMMENT, {
    update: () => {
      setComment('')
    },
  })

  function submitComment() {
    createComment({
      variables: {
        postId,
        body: comment,
      },
    })
  }

  const { user } = useContext(AuthContext)

  const callBackDelete = () => {
    history('/')
  }

  let Markup

  if (data) {
    const {
      body,
      createdAt,
      id,
      commentsCount,
      username,
      comments,
      likesCount,
      likes,
    } = data.getPost

    Markup = (
      <Grid style={{ marginTop: 15 }}>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Button
                  color='blue'
                  icon='comments'
                  basic
                  label={{
                    color: 'blue',
                    pointing: 'left',
                    content: commentsCount,
                  }}
                  onClick={() => console.log('Clicked')}
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={callBackDelete} />
                )}
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form>
                  <div className='ui action input fluid'>
                    <input
                      type='text'
                      placeholder='comment..'
                      name='comment'
                      value={comment}
                      autoComplete='off'
                      onChange={(event) => setComment(event.target.value)}
                    />
                    <button
                      type='submit'
                      className='ui teal button'
                      onClick={submitComment}
                      disabled={comment.trim() === ''}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <CardContent>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>
                    {moment(comment.createdAt).fromNow(true)}
                  </Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </CardContent>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return (
    <>
      {' '}
      {loading && <h2>Loading</h2>}
      {error && <h2>There is an error</h2>}
      {Markup}
    </>
  )
}

export default SinglePost
