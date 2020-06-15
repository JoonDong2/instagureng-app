import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import styled from "styled-components";
import styles from "../../styles";
import AnimatedEllipsis from 'react-native-animated-ellipsis';

const iosSpacing = -10;
const iosMarginTop = -30;
const androidSpacing = -5;
const androidMarginTop = -35;

const Button = styled(TouchableOpacity)`
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: ${styles.blueColor};
    border-radius: 4px;
    padding: 6.5px 10px;
`;

const DotsWrapper = styled.View`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const FollowButtonPresenter = ({ style, isFollowing, isUpdating, onPress }) => {
    return (
        <Button style={style} onPress={onPress}>
            {isUpdating && (
                <DotsWrapper>
                    <AnimatedEllipsis 
                        minOpacity={0.4}
                        style={{
                            marginTop: Platform.OS === "ios" ? iosMarginTop : androidMarginTop,
                            fontSize: 50,
                            letterSpacing: Platform.OS === "ios" ? iosSpacing : androidSpacing,
                          }}/>
                </DotsWrapper>
            )}
            <Text style={{color: "white"}}>{isFollowing ? "언팔로우" : "팔로우"}</Text>
        </Button>
    );
}

export default FollowButtonPresenter;