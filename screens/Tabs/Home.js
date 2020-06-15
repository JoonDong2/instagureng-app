import React, {useState, useRef } from "react";
import styled from "styled-components";
import Loader from "../../components/Loader";
import {useQuery} from "react-apollo-hooks";
import {gql} from "apollo-boost";
import { RefreshControl, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import Post from "../../components/Post";
import {POST_FRAGMENT} from "../../gql_fragments";

export const FEED_QUERY = gql `
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

export const ADD_COMMENT = gql `
    mutation addComment($postId: Int!, $text: String!) {
        addComment(postId: $postId, text: $text) {
          ...PostParts
        }
    }
    ${POST_FRAGMENT}
`;

export default() => {
    const [refreshing, setRefreshing] = useState(false);
    const {loading, data, refetch} = useQuery(FEED_QUERY, {fetchPolicy: "cache-and-network"});

    let isCached = true;

    if (data === undefined) {
        isCached = false;
    }

    const refresh = async() => {
        try {
            setRefreshing(true);
            await refetch();
        } catch (e) {
            console.log(e);
        } finally {
            setRefreshing(false);
        }
    };

    const scrollView = useRef();
    const scrollTo = (position) => {
        scrollView
            .current
            .scrollTo({ y: position, animated: true});
    }

    if (loading === true && isCached === false) {
        return <Loader/>
    } else {
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                enabled
                behavior={ Platform.OS === "ios" ? "padding" : "height" }>
                <ScrollView
                    style={{ backgroundColor: "#ffffff", flex: 1 }}
                    ref={ scrollView }
                    refreshControl={
                        < RefreshControl 
                            refreshing = {
                                refreshing
                            }
                            onRefresh = {
                                refresh
                            } 
                        />
                    }>
                    {data && data.seeFeed && data
                        .seeFeed
                        .map(post => (<Post key={post.id} {...post} me={data.me} scrollTo={scrollTo}/>))
}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}