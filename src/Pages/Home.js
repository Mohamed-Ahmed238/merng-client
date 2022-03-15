import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../Component/PostCard'
import { AuthContext } from '../Context/auth'
import PostForm from '../Component/PostForm'
import { GET_ALL_POSTS } from '../util/get_posts_graphql'

function Home() {
  const { user } = useContext(AuthContext)

  const { error, loading, data } = useQuery(GET_ALL_POSTS)
  return (
    <div>
      {error && <h1>There is an error happens...</h1>}

      <Grid columns={3}>
        <Grid.Row className='header'>
          <h1>Recent Posts</h1>
        </Grid.Row>

        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading && <h1>Loading...</h1>}
          <Transition.Group duration={200}>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default Home
