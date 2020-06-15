import styled from "styled-components";
import React, { useState } from "react";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../gql_fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";
import { RefreshControl, Text, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "../../styles";
import { Auth } from "aws-amplify";

export const ME = gql`
  {
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

const LogOutButton = styled(TouchableOpacity)`
  text-align: right;
  padding: 6.5px 8px;
  border-radius: 4px;
  margin-right: 13px;
  align-items: center;
  width: 75px;
  background-color: ${styles.redColor};
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(ME, {
    fetchPolicy: "cache-and-network"
  });

  const logOut = async () => {
    await Auth.signOut();
  }

  navigation.setOptions({
    headerRight: () => <LogOutButton onPress={logOut}><Text style={{color: "white"}}>Log Out</Text></LogOutButton>
  });

  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  if(loading) {
    return <Loader/>
  } else {
    return (
      <EScrollView 
        refreshControl={
          <RefreshControl 
              refreshing={
                refreshing
              } 
              onRefresh={refresh}
          />
        }
        keyboardOffset={Platform.OS === "ios" ? 35 : 100}>
        <UserProfile user={data?.me} me={data?.me} />
      </EScrollView>
    );
  }
  
}