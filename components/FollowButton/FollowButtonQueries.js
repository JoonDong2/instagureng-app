import { gql } from "apollo-boost";
import { POST_FRAGMENT, USER_FRAGMENT } from "../../gql_fragments";

export const TOGGLE_FOLLOW = gql`
  mutation toggleFollow($id: Int!) {
    toggleFollow(id: $id) {
      id
    }
  }
`;

export const FEED_QUERY = gql`
    {
        seeFeed {
          ...PostParts
        }
        me {
          id
          userName
          avatar
        }
    }
    ${POST_FRAGMENT}
`;

export const SEARCH = gql`
    query search($term: String!) {
        searchPost(term: $term) {
            ...PostParts
        }
        searchUser(term: $term) {
            ...UserParts
        }
        me {
            ...UserParts
        }
    }
    ${POST_FRAGMENT}
    ${USER_FRAGMENT}
`;

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;