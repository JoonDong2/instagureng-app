import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";

const Container = styled.View `
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput `
    width: ${constants.width / 1.7};
    padding: 10px;
    background-color: ${props => props.theme.greyColor};
    border: 1px solid ${props => props.theme.darkGreyColor};
    border-radius: 4px;
`;

const AuthInput = ({
    placeholder,
    keybordType = "default",
    autoCapitalize = "none",
    returnKeyType = "done",
    onChangeText,
    onSubmitEditing = () => null,
    autoCorrect = true,
    value,
    secureTextEntry = false
}) => (
    <Container>
        <TextInput
            onChangeText={onChangeText}
            keybordType={keybordType}
            returnKeyType={returnKeyType}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            onSubmitEditing={onSubmitEditing}
            autoCorrect={autoCorrect}
            value={value}
            secureTextEntry={secureTextEntry}/>
    </Container>
)

AuthInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    keyboardType: PropTypes.oneOf([
        "default",
        "number-pad",
        "decimal-pad",
        "numeric",
        "email-address",
        "phone-pad"
    ]),
    autoCapitalize: PropTypes.oneOf([
        "none", 
        "sentences", 
        "words", 
        "characters"]),
    onChangeText: PropTypes.func.isRequired,
    returnKeyType: PropTypes.oneOf([
        "done", 
        "go", 
        "next", 
        "search", 
        "send"]),
    onSubmitEditing: PropTypes.func,
    autoCorrect: PropTypes.bool
};

export default AuthInput;