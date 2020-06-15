import { gql } from "apollo-boost";
export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    location
    caption
    user {
        id
        avatar
        userName
        fullName
        firstName
    }
    files {
        id
        url
    }
    likesCount
    isLiked
    comments {
        id
        user {
            userName
            fullName
            firstName
        }
        text
    }
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    avatar
    userName
    fullName
    isFollowing
    isSelf
    bio
    followingCount
    followersCount
    postsCount
    posts {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;