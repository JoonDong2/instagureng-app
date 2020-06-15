import React, {useState} from "react";
import FollowButtonPresenter from "./FollowButtonPresenter";
import { useMutation } from "react-apollo-hooks";
import {TOGGLE_FOLLOW, FEED_QUERY, ME} from "./FollowButtonQueries";


const FollowButtonContainer = ({style, id, isFollowing: isFollowingProp, isSelf}) => {
    const [isFollowing, setIsFollowing] = useState(isFollowingProp);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [toggleFollowMutation] = useMutation(TOGGLE_FOLLOW, {
        variables: {
            id
        },
        refetchQueries: () => [{ query: FEED_QUERY }, { query: ME }]
    });

    const onPress = async () => {
        if (isUpdating === false && isSelf === false) {
            let result = false;

            setIsUpdating(true);

            try {
                result = await toggleFollowMutation();
            } catch (error) {
                console.log(error);
                result = false;
            }

            if (result) {
                setIsFollowing(!isFollowing);
            }

            setIsUpdating(false);
        }
    }

    return <FollowButtonPresenter
                style={style}
                isFollowing={isFollowing}
                isUpdating={isUpdating}
                onPress={onPress}/>
}

export default FollowButtonContainer;