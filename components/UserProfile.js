import React, {useState} from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components";
import styles from "../styles";
import constants from "../constants";
import Avatar from "./Avatar";
import { GridIcon, ListIcon } from "./Icons";
import SquarePhoto from "./SquarePhoto";
import Post from "../components/Post";

const Container = styled.View`
    flex: 1;
    background-color: white;
`;

const Header = styled.View`
    flex-direction: row;
    padding: 20px 40px;
    align-items: center;
`;

const ProfileStats = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding-left: 20px;
`;

const Stat = styled.View`
    flex: 1;
    align-items: center;
`;

const Bold = styled.Text`
    font-weight: 600;
`;

const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;

const ProfileMeta = styled.View`
  margin-top: 10px;
  padding: 0 20px;
`;
const Bio = styled.Text``;

const ButtonContainer = styled.View`
  padding: 0 5px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-top-color: ${styles.lightGreyColor};
  border-bottom-color: ${styles.lightGreyColor};
  flex-direction: row;
  margin-top: 30px;
`;

const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;

const PostsContainer = styled.View`
    margin-top: 20px;
`;

export default ({user, me}) => {
    return (
        <Container>
            <Header>
                <Avatar url={user.avatar} size={80}/>
                <ProfileStats>
                    <Stat>
                        <Bold>{user.postsCount}</Bold>
                        <StatName>Posts</StatName>
                    </Stat>
                    <Stat>
                        <Bold>{user.followersCount}</Bold>
                        <StatName>Followers</StatName>
                    </Stat>
                    <Stat>
                        <Bold>{user.followingCount}</Bold>
                        <StatName>Following</StatName>
                    </Stat>
                </ProfileStats>
            </Header>
            <ProfileMeta>
                <Bold>{user.fullName}</Bold>
                <Bio>{user.bio ? user.bio : "no bio"}</Bio>
            </ProfileMeta>
            <PostsContainer 
                style={{flexDirection: "row", flexWrap: "wrap"}}>
                {
                    user?.posts?.map(post =>
                        <SquarePhoto key={post.id} post={post} me={me} />
                    )
                }
            </PostsContainer>
        </Container>
    );
}