import React from "react";
import {View,Text} from "react-native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { createStackNavigator  } from "@react-navigation/stack";
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Tabs/Notifications";
import Profile from "../screens/Tabs/Profile";
import MessageLink from "../components/MessageLink";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import { barStyles } from "./config";

const TabItemStackNavigation = createStackNavigator();

const TabItemStack = ({ route, navigation }) => {
    const { initialRoute, customConfig } = route.params;

    return (
        <TabItemStackNavigation.Navigator
            screenOptions={
                {
                    ...customConfig,
                    headerTitleAlign: "center",
                    headerStyle: {
                        ...barStyles
                    } 
                }
            }
        >
            <TabItemStackNavigation.Screen
                name={route.name}
                component={initialRoute}/>
        </TabItemStackNavigation.Navigator>
    );
}

const TabNavigation = createBottomTabNavigator();

export default() => {
    return (
        <TabNavigation.Navigator 
            initialRouteName="Home" 
            tabBarOptions={
                {
                    showLabel: false,
                    tabStyle: {
                        ...barStyles
                    }
                }
            }
        >
            <TabNavigation.Screen 
                name="Home" 
                component={TabItemStack}
                initialParams={{
                    initialRoute: Home,
                    customConfig: {
                        title: "Home",
                        headerRight: () => (
                            <MessageLink/>
                        ),
                        headerTitle: () => <NavIcon name="logo-instagram" size={36} />
                    }
                }}
                options={
                    {
                        tabBarIcon: ({focused}) => <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home" }/>
                    }
                }
            />
            <TabNavigation.Screen
                name="Search" 
                component={TabItemStack}
                initialParams={{
                    initialRoute: Search
                }}
                options={
                    {
                        tabBarIcon: ({focused}) => <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-search" : "md-search" }/>
                    }
                }
            />
            <TabNavigation.Screen
                name="Add"
                component={View}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                      // Prevent default action
                      e.preventDefault();
                
                      // Do something with the `navigation` object
                      navigation.navigate('PhotoNavigation');
                    },
                  })
                }
                options={
                    {
                        tabBarIcon: ({focused}) => <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-add" : "md-add" }/>
                    }
                }
            />
            <TabNavigation.Screen
                name="Notifications" 
                component={TabItemStack}
                initialParams={{
                    initialRoute: Notifications,
                    customConfig: {
                        title: "Notifications",
                    }
                }}
                options={
                    {
                        tabBarIcon: ({focused}) => <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-heart" : "md-heart" }/>,
                    }
                }
            />
            <TabNavigation.Screen
                name="Profile" 
                component={TabItemStack}
                initialParams={{
                    initialRoute: Profile,
                    customConfig: {
                        title: "Pofile",
                    }
                
                }}
                options={
                    {
                        tabBarIcon: ({focused}) => <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person" }/>
                    }
                }
            />
            
        </TabNavigation.Navigator>
    );
}