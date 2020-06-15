import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AuthNavigation from "../navigation/AuthNavigation";
//import MainNavigation from "../navigation/MainNavigation";
import DummyNavigation from "../navigation/DummyNavigation";

export default ({isLoggedIn}) => {
    return isLoggedIn ? <DummyNavigation /> : <AuthNavigation />;
};