import React from "react";
import styled from "styled-components";
import Proptypes from "prop-types";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

export const Back = ({ size = 28, color = styles.blackColor }) => (
    <Ionicons
        size={size}
        name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
    />
)

export const HeartEmpty = ({ size = 28, color = styles.blackColor }) => (
    <Ionicons 
        size={size}
        name={Platform.OS === "ios" ? "ios-heart-empty" : "md-heart-empty"}
    />
)

export const HeartFull = ({ size = 28, color = styles.redColor }) => (
    <Ionicons 
        size={size}
        name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
        color={color}
    />
)

export const TextIcon = ({ size = 28, color = styles.blackColor }) => (
    <Ionicons 
        size={size}
        name={Platform.OS === "ios" ? "ios-text" : "md-text"}
        color={color}
    />
)

export const GridIcon = ({ size = 32, color = styles.blackColor }) => (
    <Ionicons
        size={size}
        name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
        color={color}
    />
)

export const ListIcon = ({ size = 32, color = styles.blackColor }) => (
    <Ionicons
        size={size}
        name={Platform.OS === "ios" ? "ios-list" : "md-list"}
        color={color}
    />
)

export const UploadIcon = ({ size = 32, color = styles.blackColor }) => (
    <Ionicons
        size={size}
        name={Platform.OS === "ios" ? "ios-cloud-upload" : "md-cloud-upload"}
        color={color}
    />
)

export const CameraRotateIcon = ({ size=32, color = "white" }) => (
    <Ionicons
        name={ Platform.OS === "ios" ? "ios-reverse-camera" : "md-reverse-camera" }
        size={size}
        color={color}
    />
)