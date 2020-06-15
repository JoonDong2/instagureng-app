import React, {useState, Component, memo} from "react";
import { View, Text, Image, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components";
import Swiper from "react-native-swiper";
import constants from "../../constants";
import { HeartEmpty, HeartFull, TextIcon } from "../Icons";
import styles from "../../styles";
import TouchableOpacityText from "../TouchableOpacityText";
import ReadMore from 'react-native-read-more-text';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
    margin-top: 5px;
`;
const Header = styled.View`
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

const Location = styled.Text`
    margin-top: 5px;
    font-size: 12px;
`;

const marginTopForInfoContainer = Platform.OS === "ios" ? "-35px" : "-45px"

const InfoContainer = styled.View`
    margin-top: ${marginTopForInfoContainer};
    padding: 10px 10px 0;
`;

const IconsContainer = styled.View`
    flex-direction: row;
`;

const IconContainer = styled.View`
    margin-left: 10px;
`;

const LikeContainer = styled.View`
    margin-left: 3px;
`;

const Caption = styled.View`
    margin-top: 5px;
`;

const TextExpanderContainer = styled.View`
    margin-top: 10px;
    align-items: flex-end;
`;
const TextExpander = styled.Text`
    color: ${styles.blueColor};
`;

const CommentsContainer = styled.Text`
    margin: 5px 0 0;
`;
const CommentContainer = styled.Text`
`;

const CommentInputContainer = styled.View`
  padding: 0 10px;
  margin: 15px 0;
  min-height: 30px;
  flex-direction: row;
  align-items: flex-end;
`;

const Me = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 15px;
`;

const OpenComments = styled.TouchableOpacity`
    height: 25px;
`;

const PostPresenterInside = ({ 
    id,
    user, 
    location, 
    files = [],
    likesCount,
    caption,
    comments,
    isLiked,
    toggleLike,
    me,
    scrollTo,
    setY,
    setOffset,
    getPosition
}) => {
    const navigation = useNavigation();

    const delay = (ms) => {
         return new Promise(resolve => setTimeout(resolve, ms));
    }

    const GoComment = () => {
        navigation.navigate("Comment", {
            postId: id,
            me: me
        });
    }

    const GoComments = () => {
        navigation.navigate("Comments", {
            postId: id,
            comments: comments,
            me: me
        });
    }

    const viewMore = (onPress) => (
        <TextExpanderContainer>
            <TextExpander onPress={onPress}>More info</TextExpander>
        </TextExpanderContainer>
    )
    
    const closeMore = (onPress) => (
        <TextExpanderContainer>
            <TextExpander onPress={onPress}>Close</TextExpander>
        </TextExpanderContainer>
    )

    const author = user.fullName || user.firstName || user.userName;

    return (
        <Container onLayout={event => {
            const layout = event.nativeEvent.layout;
            setY(layout.y);
            //console.log("parent: ", layout.y);
        }}> 
            <TouchableOpacity onPress={()=>navigation.navigate("UserDetail", {userName: user.userName, author})}>
                <Header>
                    <Image
                        style={{ height: 40, width: 40, borderRadius: 20 }}
                        source={{ uri: user.avatar }}
                    />
                    <HeaderUserContainer>
                        <Bold>{author}</Bold>
                        {location !== "" ? <Location>{location}</Location> : null}
                    </HeaderUserContainer>
                </Header>
            </TouchableOpacity>
            <Swiper
                showsPagination={false}
                style={{ height: constants.height * 0.6 }}
            >
                {files.map(file => (
                    <Image
                        style={{ width: constants.width, height: constants.height * 0.55 }} 
                        key={file.id}
                        source={{ uri: file.url }}
                    />
                ))}
            </Swiper>
            
            <InfoContainer>
                <IconsContainer>
                    <IconContainer>
                        <TouchableOpacity onPress={toggleLike}>
                            {isLiked === true ? <HeartFull/> : <HeartEmpty/>}
                        </TouchableOpacity>
                    </IconContainer>
                    <IconContainer>
                        <TouchableOpacity>
                            <TextIcon />
                        </TouchableOpacity>
                    </IconContainer>
                </IconsContainer>
                <LikeContainer>
                    <Bold>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</Bold>
                </LikeContainer>
                <Caption>
                    <ReadMore 
                        numberOfLines={1}
                        renderTruncatedFooter={viewMore}
                        renderRevealedFooter={closeMore}
                    >
                        <Text>
                            <TouchableOpacityText onPress={()=>navigation.navigate("UserDetail", {userName: user.userName, author})} style={{color: styles.blueColor}}>{author}</TouchableOpacityText>
                            {" "}
                            <Text>{caption}</Text>
                        </Text>
                    </ReadMore>
                </Caption>
                {Object.keys(comments).length > 0 &&
                    <TouchableWithoutFeedback onPress={()=>GoComments()}>
                        <CommentsContainer numberOfLines={4} ellipsizeMode={"middle"}>
                            {comments.map((comment, index) => (
                                index > 2 ? (
                                    index === 3 ? (
                                        <Text key={comment.id}>{"..."}</Text>
                                    ) : (
                                        null
                                    )
                                ) : (
                                    <CommentContainer key={comment.id} numberOfLines={2} ellipsizeMode={"tail"}>
                                        <Bold>{comment.user.fullName || comment.user.firstName || comment.user.userName}{"  "}</Bold>
                                        <Text>{comment.text}</Text>
                                        {index < comments.length - 1 ? <Text>{"\r\n"}</Text> : null}
                                    </CommentContainer>
                                ) 
                            ))}
                        </CommentsContainer>
                    </TouchableWithoutFeedback>
                }
            </InfoContainer>
            <CommentInputContainer onLayout={event => {
                const layout = event.nativeEvent.layout;
                //console.log("child: ", layout.y);
                setOffset(layout.y)
            }}>
                <Me source={{uri: me.avatar}} />
                <OpenComments 
                    onPress={()=>{
                        //console.log("yPosition: ", getY());
                        if(scrollTo !== undefined) {
                            Keyboard.addListener("keyboardDidShow", (event) => {
                                //console.log(getY());
                                const platformOffset = Platform.OS === "ios" ? 95 : 165;
                                scrollTo(getPosition() - (constants.height - event.endCoordinates.height - platformOffset));
                                Keyboard.removeAllListeners("keyboardDidShow");
                            });
                        }
                        GoComment();
                    }}
                >
                    <Text style={{color: styles.darkGreyColor}}>댓글 달기..</Text>
                </OpenComments>
            </CommentInputContainer>
        </Container>
    )
}

class PostPresenter extends Component {
    yPosition = 0;
    yOffset = 0

    setY = (position) => {
        this.yPosition = position;
    }
    
    setOffset = (position) => {
        this.yOffset = position;
    }

    getPosition = () => this.yOffset + this.yPosition

    render() {
        return (
            <PostPresenterInside 
                id={this.props.id}
                user={this.props.user}
                location={this.props.location}
                files ={this.props.files}
                likesCount={this.props.likesCount}
                caption={this.props.caption}
                comments={this.props.comments}
                isLiked={this.props.isLiked}
                toggleLike={this.props.toggleLike}
                me={this.props.me}
                scrollTo={this.props.scrollTo}
                setY={this.setY}
                setOffset={this.setOffset}
                getPosition={this.getPosition}
            />
        )
    }
}

export default PostPresenter