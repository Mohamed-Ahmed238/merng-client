import React, { useState, useEffect } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'

const LIKE_BUTTON = gql`
  mutation likePost($likePostPostId: ID!) {
    likePost(postId: $likePostPostId) {
      id
      likesCount
      likes {
        id
        createdAt
        username
      }
    }
  }
`

function LikeButton({ user, post: { id, likes, likesCount } }) {
  const [liked, setLiked] = useState(false)
  const history = useNavigate()

  useEffect(() => {
    if (user && likes.some((like) => like.username === user.username)) {
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [likes, user])

  const [likePost] = useMutation(LIKE_BUTTON)

  const likeButton = () => {
    if (user) {
      likePost({ variables: { likePostPostId: id } })
    } else history('/login')
  }

  return (
    <Popup
      content={liked ? 'Unlike the post' : 'Like the Post'}
      inverted
      trigger={
        <Button
          color='teal'
          icon='heart'
          label={{
            color: 'teal',
            pointing: 'left',
            content: likesCount,
          }}
          basic={user && liked ? false : true}
          onClick={likeButton}
        />
      }
    />
  )
}

export default LikeButton
