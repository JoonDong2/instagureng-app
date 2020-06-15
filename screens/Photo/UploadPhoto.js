import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Platform, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from "react-native";
import {TextInput, ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import {RNS3} from 'react-native-s3-upload';
import {gql} from "apollo-boost";
import {useMutation} from "react-apollo-hooks";
import {FEED_QUERY} from "../Tabs/Home";
import {ME} from "../Tabs/Profile";
import {Back} from "../../components/Icons";
import Constants from 'expo-constants';

const UPLOAD = gql `
  mutation upload($caption: String!, $files: [String!]!, $location: String) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      caption
      location
    }
  }
`;

const options = {
    keyPrefix: "uploads/",
    bucket: "joondong-prismagram",
    region: "ap-northeast-2",
    accessKey: Constants.manifest.extra.AWS_S3_ACCESS_KEY,
    secretKey: Constants.manifest.extra.AWS_S3_SECRET_KEY,
    successActionStatus: 201
}

const Container = styled.View `
  flex: 1;
  background-color: #fff;
`;

const Caption = styled.View `
  flex-direction: row;
  padding: 10px;
  align-items: center;
  border-bottom-color: ${styles.lightGreyColor};
  border-bottom-width: 0.5px;
`;

const Image = styled.Image `
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const HeaderButton = styled.View `
  padding: 10px;
`;

const Location = styled.View `
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text `
  font-size: 16px;
  color: ${styles.blackColor};
`;

export default({route, navigation}) => {
    const [postLoading, setPostLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const {photos} = route.params;
    const captionInput = useInput("");
    const locationInput = useInput("");
    const [uploadMutation] = useMutation(UPLOAD, {
        refetchQueries: () => [{ query: FEED_QUERY }, {  query: ME }]
    });

    navigation.setOptions({
        headerLeft: () => <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                marginLeft: 10,
                padding: 10
            }}><Back/></TouchableOpacity>
    });

    if (editing === true) {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButton>
                    <TouchableOpacity onPress={Keyboard.dismiss}>
                        <Text>확인</Text>
                    </TouchableOpacity>
                </HeaderButton>
            )
        });
    } else {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButton>
                    <TouchableOpacity onPress={() => post()} disabled={postLoading}>
                        {postLoading
                            ? (<ActivityIndicator color={styles.darkGreyColor}/>)
                            : (
                                <Text>게시</Text>
                            )}
                    </TouchableOpacity>
                </HeaderButton>
            )
        });
    }

    const _keyboardDidShow = () => setEditing(true)
    const _keyboardDidHide = () => setEditing(false)

    const post = async() => {
        let photoUrls = [];
        setPostLoading(true);
        try {
            const promises = photos.map(async(photo) => {
                const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: photo.uri,
                    name: photo.id + "_" + photo.filename,
                    type: "image/png"
                }

                const response = await RNS3.put(file, options);

                if (response.status !== 201) {
                    throw new Error("Failed to upload image to S3");
                }

                const {location} = response.body.postResponse;
                photoUrls = photoUrls.concat(location);
            });

            await Promise.all(promises);

            const {data: {
                    upload
                }} = await uploadMutation({
                variables: {
                    files: photoUrls,
                    caption: captionInput.value,
                    location: locationInput.value
                }
            });

            if (upload.id) {
                navigation.navigate("TabNavigation");
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    return (
        <TouchableWithoutFeedback
            style={{
            flex: 1
        }}
            onPress={Keyboard.dismiss}>
            <Container
                enabled
                behavior={Platform.OS == "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}>
                <Caption>
                    <Image
                        source={{ uri: photos[0].uri }}/>
                    <ScrollView style={{ flex: 1 }}>
                        <TextInput placeholder={"Caption"} multiline {...captionInput}/>
                    </ScrollView>
                </Caption>
                <Location>
                    <LocationText
                        style={{
                        marginRight: 10
                    }}>위치</LocationText>
                    <TextInput placeholder={"위치 입력.."} multiline {...locationInput}/>
                </Location>
            </Container>
        </TouchableWithoutFeedback>
    );
};