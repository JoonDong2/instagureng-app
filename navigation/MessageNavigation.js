import React from "react";
import { createStackNavigator  } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import Messages from "../screens/Messages/Messages";
import Message from "../screens/Messages/Message";
import { barStyles } from "./config";

const MessageNavigation = createStackNavigator();

export default () => {
    return (
        <MessageNavigation.Navigator 
            screenOptions={
                {
                    headerStyle: {
                        ...barStyles
                    }
                }
            }
        >
            <MessageNavigation.Screen name="Messages" component={Messages} />
            <MessageNavigation.Screen name="Message" component={Message} />
        </MessageNavigation.Navigator>
    );
};