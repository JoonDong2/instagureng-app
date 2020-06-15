import { gql } from "apollo-boost";
import { POST_FRAGMENT } from "../../gql_fragments";

export const TOGGLE_LIKE = gql`
    mutation toggleLike($postId: Int!) {
        toggleLike(postId: $postId) {
            id
        }
    }
`;