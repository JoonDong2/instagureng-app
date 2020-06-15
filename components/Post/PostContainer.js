import React, {useState, useEffect, memo} from "react";
import Proptypes from "prop-types";
import { useMutation } from "react-apollo-hooks";
import PostPresenter from "./PostPresenter";
import { TOGGLE_LIKE } from "./PostQueries";

const PostContainer = ({ 
    id,
    user, 
    location, 
    files = [],
    likesCount: likesCountProp,
    caption,
    comments = [],
    isLiked: isLikedProp,
    me,
    scrollTo
}) => {
    const [isLiked, setIsLiked] = useState(isLikedProp);
    const [likesCount, setLikesCount] = useState(likesCountProp);

    useEffect(() => {
        setIsLiked(isLikedProp);
        setLikesCount(likesCountProp)
    }, [isLikedProp, isLikedProp]);

    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: {
            postId: id
        }
    });

    const toggleLike = async () => {
        const isLiked_backup = isLiked;
        const likesCount_backup = likesCount;

        if (isLiked === true) {
            setIsLiked(false);
            setLikesCount(likesCount - 1);
        } else {
            setIsLiked(true);
            setLikesCount(likesCount + 1);
        }

        let toggleComplete = false;

        try {
            const result = await toggleLikeMutation();

            if(result?.data?.toggleLike !== undefined) {
                toggleComplete = true;
            }
            
        } catch (error) {
            toggleComplete = false;
        }

        // 데이터베이스에서 토글을 실패하면 원상복구 시킨다.
        if (toggleComplete !== true) {
            setIsLiked(isLiked_backup);
            setLikesCount(likesCount_backup);
        }
    }

    return (
        <PostPresenter 
            id={id}
            user={user} 
            location={location}
            files={files}
            likesCount={likesCount}
            caption={caption}
            comments={comments}
            isLiked={isLiked}
            toggleLike={toggleLike}
            me={me}
            scrollTo={scrollTo}
        />
    );
}

export default PostContainer