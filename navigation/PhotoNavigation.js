import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator  } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TakePhoto from '../screens/Photo/TakePhoto';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';
import styles from "../styles";
import { barStyles } from './config';

const PhotoTabsNavigattion = createMaterialTopTabNavigator();

const PhotoTabs = () => {
    return(
        <PhotoTabsNavigattion.Navigator 
            tabBarPosition="bottom" 
            tabBarOptions={{
                indicatorStyle: { 
                    backgroundColor: styles.blackColor,
                },
                labelStyle: { 
                    color: styles.blackColor,
                },
                style: {
                    ...barStyles
                }
            }}
        >
            <PhotoTabsNavigattion.Screen name="Select Photo" component={SelectPhoto}/>
            <PhotoTabsNavigattion.Screen name="Take Photo" component={TakePhoto} />
        </PhotoTabsNavigattion.Navigator>
    );
}

const PhotoStackNavigation = createStackNavigator();

export default () => {
    return(
        <PhotoStackNavigation.Navigator 
            headerMode="screen"
            screenOptions={{
                headerStyle: {
                    ...barStyles,
                }
            }}>
            <PhotoStackNavigation.Screen name="PhotoTabs"
                                        component={PhotoTabs}
                                        options={{ headerShown: false }}/>
            <PhotoStackNavigation.Screen name="UploadPhoto" 
                                        component={UploadPhoto}
                                        options={{headerTitleAlign: "center"}}
                                        />
        </PhotoStackNavigation.Navigator>
    );
}