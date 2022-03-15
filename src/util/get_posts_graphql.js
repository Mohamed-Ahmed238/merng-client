import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query {
    getPosts {
      body
      createdAt
      id
      username
      comments {
        body
        createdAt
        id
        username
      }
      likes {
        username
      }
      likesCount
      commentsCount
    }
  }
`
