import React from "react";
import styled from "styled-components";
import Post from "../components/Post";
import { Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import styles from "../styles";
import { Back } from "../components/Icons";

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const EScrollView = styled(ScrollView)`
  background-color: #ffffff;
  flex: 1;
`;

export default ({ route, navigation }) => {
  const { post, me } = route.params;

  navigation.setOptions({
    headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 10, padding: 10}}><Back/></TouchableOpacity>
});

  return (
    <Container>
      <EScrollView 
        keyboardOffset={Platform.OS === "ios" ? 35 : 100}
      >
        <Post {...post} me={me} />
      </EScrollView>
    </Container>
  );
}