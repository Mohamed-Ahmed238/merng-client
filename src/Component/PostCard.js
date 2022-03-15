import React, { useContext } from 'react'
import { Card, Image, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../Context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard({
  post: {
    body,
    createdAt,
    id,
    username,
    likesCount,
    commentsCount,
    likes,
    comments,
  },
}) {
  const { user } = useContext(AuthContext)

  return (
    <Card.Group>
      <Card fluid>
        <Card.Content as={Link} to={`/posts/${id}`}>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <LikeButton user={user} post={{ id, likes, likesCount }} />
          <Popup
            content='Post a comment'
            inverted
            trigger={
              <Button
                color='blue'
                icon='comments'
                basic
                label={{
                  color: 'blue',
                  pointing: 'left',
                  content: commentsCount,
                }}
                as={Link}
                to={`/posts/${id}`}
              />
            }
          />
          {user && user.username === username && <DeleteButton postId={id} />}
        </Card.Content>
      </Card>
    </Card.Group>
  )
}

export default PostCard
