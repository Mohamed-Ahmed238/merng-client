import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { GET_ALL_POSTS } from '../util/get_posts_graphql'

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST

  const [deleted] = useMutation(mutation, {
    update: (proxy) => {
      setConfirmOpen(false)
      if (!commentId) {
        const data = proxy.readQuery({
          query: GET_ALL_POSTS,
        })

        proxy.writeQuery({
          query: GET_ALL_POSTS,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        })
      }
      if (callback) callback()
    },
  })

  const deleteMutation = () => {
    deleted({ variables: { postId, commentId } })
  }

  return (
    <>
      <Popup
        content={commentId ? 'Delete comment' : 'Delete post'}
        inverted
        trigger={
          <Button
            as='div'
            color='red'
            onClick={() => setConfirmOpen(true)}
            floated='right'
          >
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteMutation}
      />
    </>
  )
}

export default DeleteButton
