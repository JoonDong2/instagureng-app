import React from "react";
import styled from "styled-components";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../gql_fragments";
import Loader from "../components/Loader";
import UserProfile from "../components/UserProfile";
import { Text, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Back } from "../components/Icons";
import FollowButton from "../components/FollowButton";

const GET_USER = gql`
  query seeUser($userName: String!) {
    seeUser(userName: $userName) {
      ...UserParts
    }
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

const EScrollView = styled(ScrollView)`
  background-color: #ffffff;
  flex: 1;
`;

export default ({ route, navigation }) => {
  const { userName, author } = route.params;
  const { loading, data } = useQuery(GET_USER, {
      variables: {
          userName: userName
      },
      fetchPolicy:"network-only"
  });
  
  navigation.setOptions({
      headerTitle: () => <Text style={{maxWidth: 165}} numberOfLines={1} ellipsizeMode={"tail"}>{author}</Text>,
      headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 10, padding: 10}}><Back/></TouchableOpacity>,
      headerRight: () => {
        if(data?.seeUser?.isSelf === false) {
          return <FollowButton style={{marginRight: 10}} id={data?.seeUser?.id} isFollowing={data?.seeUser?.isFollowing} isSelf={data?.seeUser?.isSelf} />
        } else {
          return null;
        }
      }
  });

  if(loading) {
    return <Loader/>
  } else {
    return (
      <EScrollView 
        keyboardOffset={Platform.OS === "ios" ? 35 : 100}>
        <UserProfile user={data?.seeUser} me={data?.me}/>
      </EScrollView>
    );
  }
}