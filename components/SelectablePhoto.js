import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
`;

const CheckCover = styled.View`
    position: absolute;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    opacity: 0.5;
    background-color: black;
    padding:5px;
`;

export default ({onSelected, onDeselected, size, url}) => {
    const [isSelected, setIsSelected] = useState(false);

    const _onPress = () => {
        if(isSelected && onDeselected !== undefined) {
            onDeselected();
        }
    
        if(!isSelected && onSelected !== undefined) {
            onSelected();
        }

        setIsSelected(i => !i);
    }

    return (
        <TouchableOpacity onPress={_onPress}>
            <Container style={{width: size, height: size}}>
                <Image
                    style={{width: size, height: size, position: 'absolute', top: 0, left: 0}}
                    source={{ uri: url }}
                />
                {isSelected ? (
                    <CheckCover style={{height: '100%', width: '100%'}}>
                        <Ionicons 
                            size={size}
                            name={"md-checkmark"}
                            color={"white"}
                        />
                    </CheckCover>
                ) : (
                    null
                )}
            </Container>
        </TouchableOpacity>
    );
};