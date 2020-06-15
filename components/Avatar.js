import React from "react";
import styled from "styled-components";
import { Image } from "react-native";

const Container = styled.View`
    
`;

const NO_IMAGE = "https://3.bp.blogspot.com/-qtEejOg1NHA/Xobmg2y_QeI/AAAAAAAAIVE/UFKPvpeHjKUqCEFOX8lT4MsKz-PwpEGJgCLcBGAsYHQ/s1600/default_user.png"

export default ({url = NO_IMAGE, size = 100}) => {
    const borderRadius = size / 2;

    return (
        <Image
            style={{ height: size, width: size, borderRadius: borderRadius }}
            source={{uri: url}}
        />
    );
}