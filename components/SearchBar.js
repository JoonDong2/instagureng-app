import React from "react";
import { TextInput } from "react-native";
import PropTypes from "prop-types";
import styles from "../styles";
import constants from "../constants";

const SearchBar = ({term, onSubmit, onChange}) => (
    <TextInput
        style={{
            width: constants.width - 40,
            height: 40,
            backgroundColor: styles.lightGreyColor,
            padding: 10,
            borderRadius: 5,
            textAlign: "center"
        }}
        placeholder={"Search"}
        value={term}
        onSubmitEditing={onSubmit}
        onChangeText={onChange}      
    />
);


export default SearchBar;