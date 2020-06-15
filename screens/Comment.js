import React, { useEffect, useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../components/Loader";
import { gql } from "apollo-boost";
import {  TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Text, View, KeyboardAvoidingView, Platform, Image, Keyboard } from "react-native";
import styles from "../styles";
import useInputV2 from "../hooks/useInputV2";
import { FEED_QUERY } from "./Tabs/Home";

const Contiainer = styled.View`
    background-color: transparent;
    flex: 1;
`;

const EditorContainer = styled.View`
    padding: 5px;
    min-height: 65px;
    border-top-color: ${styles.darkGreyColor};
    border-top-width: 0.25px;
    flex-direction: row;
    align-items: center;
    background-color: white;
`;

const ADD_COMMENT = gql`
    mutation addComment($postId: Int!, $text: String!) {
        addComment(postId: $postId, text: $text) {
            id
            text
            user {
                userName
            }
        }
    }
`;

export default ({route, navigation}) => {
    const [commenting, setCommenting] = useState(false);
    const commentInput = useInputV2("");
    const {postId, me} = route.params;

    const [addCommentMutation] = useMutation(ADD_COMMENT, {
        variables: {
            postId,
            text: commentInput.value
        },
        refetchQueries: () => [{query: FEED_QUERY}]
    });

    const addCommnet = async () => {
        if(commentInput.value !== "" && commenting === false) {
            setCommenting(true);
            try {
                const {data: {
                    addComment
                }} = await addCommentMutation();
                Keyboard.dismiss();
            } catch(e) {
                console.log(e)
            } finally {
                setCommenting(false)
            }
        }
    }

    const keyboardDidHide = () => {
        navigation.goBack();
    }

    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", keyboardDidHide);
        return () => {
            Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
        }
    }, [])

    return (
        <KeyboardAvoidingView 
            style={{flex: 1}} 
            enabled 
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Contiainer>
                <View style={{flex: 1}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{height: "100%"}}></TouchableWithoutFeedback>
                </View>
                <EditorContainer>
                    <Image
                        style={{ height: 30, width: 30, borderRadius: 15, marginRight: 10, marginLeft: 10, padding: 10 }}
                        source={{ uri: me.avatar }}
                    />
                    <TextInput {...commentInput} style={{flex: 1}} multiline placeholder={"댓글 달기.."} autoFocus={true}/>
                    <TouchableOpacity style={{width: 50}} onPress={() => addCommnet()}>
                        {commenting === true ? (
                            <Loader />
                        ) : (
                            <Text style={{color: styles.blueColor}}>게시</Text>
                        )}
                    </TouchableOpacity>
                </EditorContainer>
                
            </Contiainer>
        </KeyboardAvoidingView>
    );
}