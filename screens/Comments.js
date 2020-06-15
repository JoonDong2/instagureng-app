import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RefreshControl, Text, View, KeyboardAvoidingView, Platform, Image, Keyboard } from "react-native";
import styles from "../styles";
import TouchableOpacityText from "../components/TouchableOpacityText";
import { Back } from "../components/Icons";
import useInputV2 from "../hooks/useInputV2";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "./Tabs/Home";

const Contiainer = styled.View`
    background-color: white;
    flex: 1;
    padding-top: 10px;
`;

const EScrollView = styled(ScrollView)`
    flex: 1;
    padding: 10px;
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

const CommentContainer = styled.Text``;

const ADD_COMMENT = gql`
    mutation addComment($postId: Int!, $text: String!) {
        addComment(postId: $postId, text: $text) {
            id
            text
            user {
                userName
                fullName
                firstName
            }
        }
    }
`;

export default ({route, navigation}) => {
    const {postId, comments: commentsProp, me} = route.params;

    const [comments, setComments] = useState(commentsProp);
    const [commenting, setCommenting] = useState(false);
    const commentInput = useInputV2("");

    const [addCommentMutation] = useMutation(ADD_COMMENT, {
        variables: {
            postId: postId,
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
                commentInput.setValue("");
                setComments(comments.concat(addComment));
                Keyboard.dismiss();
            } catch(e) {
                console.log(e)
            } finally {
                setCommenting(false)
            }
            
        }
        
    }

    navigation.setOptions({
        headerTitleAlign: "center",
        headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 10, padding: 10}}><Back/></TouchableOpacity>
    });

    return (
        <KeyboardAvoidingView 
            style={{flex: 1}} 
            enabled behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}>
            <Contiainer>
                <EScrollView style={{flex: 1}}>
                    {comments.map(comment => (
                        <CommentContainer key={comment.id}>
                            <TouchableOpacityText style={{fontWeight: "bold"}}>{comment.user.fullName || comment.user.firstName || comment.user.userName}{"  "}</TouchableOpacityText>
                            <Text>{comment.text}{"\r\n"}</Text>
                        </CommentContainer>
                    ))}
                </EScrollView>
                <EditorContainer>
                    <Image
                        style={{ height: 30, width: 30, borderRadius: 15, marginLeft:10, marginRight: 10, padding: 10 }}
                        source={{ uri: me.avatar }}
                    />
                    <TextInput {...commentInput} style={{flex: 1}} multiline placeholder={"댓글 달기.."}/>
                    <TouchableOpacity onPress={() => addCommnet()} style={{width: 50}}><Text style={{color: styles.blueColor}}>게시</Text></TouchableOpacity>
                </EditorContainer>
                
            </Contiainer>
        </KeyboardAvoidingView>
    );
}