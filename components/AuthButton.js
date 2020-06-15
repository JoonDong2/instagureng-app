import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import styles from "../styles";

const Container = styled.View`
    padding: 10px;
    margin: 0px 50px;
    border-radius: 4px;
    width: ${constants.width / 1.7};
`;

const Text = styled.Text`
    color: white;
    text-align: center;
    font-weight: 600;
`;

const AuthButton = ({ backgroundColor = styles.blueColor, text, onPress, loading = false }) => (
    <TouchableOpacity style={{marginBottom:10}} disabled={loading} onPress={onPress}>
        <Container style={{backgroundColor: backgroundColor}}>
            {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
        </Container>
    </TouchableOpacity>
);

AuthButton.prototype = {
    loading: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
}

export default AuthButton;