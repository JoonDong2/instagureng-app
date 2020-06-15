import React, {useState, useEffect} from "react";
import styled from "styled-components";
import SelectablePhoto from "../../components/SelectablePhoto";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import Loader from "../../components/Loader";
import {Image} from "react-native";
import constants from "../../constants";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {UploadIcon} from "../../components/Icons";

const Container = styled.View `
  flex: 1;
  background-color: #fff;
`;

const UploadContainer = styled.View `
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

let selectedPhotos = [];

export default({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState();
    const [allPhotos, setAllPhotos] = useState();

    const askPermission = async() => {
        try {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status === "granted") {
                setHasPermission(true);
                getPhotos();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getPhotos = async() => {
        try {
            const {assets} = await MediaLibrary.getAssetsAsync();
            const [firstPhoto] = assets;
            setSelectedPhoto(firstPhoto);
            setAllPhotos(assets);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        askPermission();

        return () => {
            selectedPhotos = [];
        }
    }, []);

    const addPhoto = photo => {
        console.log(photo);
        selectedPhotos = selectedPhotos.concat(photo);
        setSelectedPhoto(photo);
    }

    const deletePhoto = photo => {
        selectedPhotos.splice(selectedPhotos.findIndex(p => p.id === photo.id), 1);
        setSelectedPhoto(photo);
    }

    const upload = () => {
        if (selectedPhotos.length > 0) {
            navigation.navigate("UploadPhoto", {photos: selectedPhotos});
        }
    }

    if (loading) {
        return <Loader/>
    } else if (hasPermission === false) {
        return <Container/>;
    } else {
        return (
            <Container>
                <Image
                    style={{
                    width: constants.width,
                    height: constants.width,
                    resizeMode: "contain"
                }}
                    source={{
                    uri: selectedPhoto.uri
                }}/>
                <ScrollView
                    contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap"
                }}>
                    {allPhotos.map(photo => (<SelectablePhoto
                        key={photo.id}
                        onSelected={() => addPhoto(photo)}
                        onDeselected={() => deletePhoto(photo)}
                        size={constants.width / 3}
                        url={photo.uri}/>))}
                </ScrollView>
                <UploadContainer>
                    <TouchableOpacity onPress={() => upload()}>
                        <UploadIcon size={75}/>
                    </TouchableOpacity>
                </UploadContainer>
            </Container>
        );
    }
}