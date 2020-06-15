import React, {useState, useEffect, useRef} from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from "expo-permissions";
import constants from "../../constants";
import Loader from "../../components/Loader";
import styles from "../../styles";
import { CameraRotateIcon } from "../../components/Icons";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Button = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;

export default ({ navigation }) => {
  const cameraRef = useRef();
  const [loading, setLoading] = useState(true);
  const [canTakePhoto, setCanTakePhoto] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasPermission(true);
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const takePhoto = async () => {
    if(!canTakePhoto) {
      return;
    }

    try {
      setCanTakePhoto(false);
      
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1
      });

      const asset = await MediaLibrary.createAssetAsync(uri);

      setCanTakePhoto(true);
      navigation.navigate("UploadPhoto", { photos: [asset] })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    askPermission();
  }, []);

  if(loading) {
    return <Loader/>
  } else {
    return(
      <Container>
        <Camera
         ref={ cameraRef }
          type={ cameraType }
          style={{
            justifyContent: "flex-end",
            padding: 15,
            width: constants.width,
            height: constants.width * 4 / 3
          }}
        >
          <TouchableOpacity onPress={ toggleType }>
            <CameraRotateIcon/>
          </TouchableOpacity>
        </Camera>
        <ButtonContainer>
          <TouchableOpacity onPress={takePhoto} disabled={!canTakePhoto}>
            <Button />
          </TouchableOpacity>
        </ButtonContainer>
        
      </Container>
    );
  }
}