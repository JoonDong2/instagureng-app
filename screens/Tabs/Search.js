import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Text, Keyboard,TouchableWithoutFeedback, RefreshControl, Image, TouchableOpacity } from "react-native";
import SearchBar from "../../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import SquarePhoto from "../../components/SquarePhoto";
import { POST_FRAGMENT, USER_FRAGMENT } from "../../gql_fragments";

const SEARCH = gql`
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

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ResultsContainer = styled.View`
  flex: 1;
`;

const UsersContainer = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: white;
`;

const PhotosContainer = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: white;
`;

const Header = styled(TouchableOpacity)`
    padding: 15px;
    flex-direction: row;
    align-items: center;
`;

const HeaderUserContainer = styled.View`
    margin-left: 10px;
`;

const Bold = styled.Text`
    font-weight: 600;
`;

const Bio = styled.Text`
    font-size: 12px;
`;

export default ({navigation}) => {
  const [doSearch, setDoSearch] = useState(false)
  const [searchInput, setSearchInput] = useState("");
  const onChange = (text) => {
    setDoSearch(false);
    setSearchInput(text);
  }
  const onSubmit = () => { 
    setDoSearch(true);
  }

  navigation.setOptions({
    headerTitle: () => <SearchBar 
                          term={searchInput}
                          onChange={onChange} 
                          onSubmit={onSubmit}/>
  });

  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    variables: {
      term: searchInput
    },
    skip: !doSearch,
    fetchPolicy:"network-only"
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch({ variables: { term }});
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  }

  if(loading) {
    return <Loader />;
  } else if(data?.searchPost?.length === 0 && data?.searchUser?.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <Text>검색 결과가 없습니다.</Text>
        </EmptyContainer>
      </Container>
    );
  } else {
    return (
      <Container>
        <ScrollView 
          refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing}/>
          }
          style={{flex: 1}}
        >
          <TouchableWithoutFeedback 
            style={{flex: 1}} onPress={Keyboard.dismiss}>
            <ResultsContainer>
              <UsersContainer>
                {data?.searchUser?.map(
                  user => (
                    user.isSelf === true ? (
                      null
                    ) : (
                      <Header key={user.id} onPress={()=>navigation.navigate("UserDetail", {userName: user.userName})}>
                        <Image
                            style={{ height: 40, width: 40, borderRadius: 20 }}
                            source={{ uri: user.avatar }}
                        />
                        <HeaderUserContainer>
                            <Bold>{user.fullName || user.firstName}</Bold>
                            {user.bio !== "" ? <Bio>{user.bio}</Bio> : null}
                        </HeaderUserContainer>
                      </Header>
                    )
                  )
                )}
              </UsersContainer>
              <PhotosContainer>
                  {data?.searchPost?.map(
                    post => <SquarePhoto key={post.id} post={post} me={data.me}/>
                  )}
              </PhotosContainer>
            </ResultsContainer>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Container>
    );
  }
}