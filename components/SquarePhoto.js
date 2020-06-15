import React from "react";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import constants from "../constants";
import { useNavigation } from "@react-navigation/native";

const SquarePhoto = ({ post, me }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("SinglePost", { post, me })}>
            <Image 
                source={{ uri: post.files[0].url }}
                style={{ width: constants.width / 3, height: constants.width / 3 }}
            />
        </TouchableOpacity>
    );
};


export default SquarePhoto;