import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Comment from '../screens/Comment';
import MainNavigation from './MainNavigation';

const DummyStackNavigation = createStackNavigator();

export default () => {
    return (
        <NavigationContainer>
              <DummyStackNavigation.Navigator mode="modal">
                <DummyStackNavigation.Screen name="MainNavigation" component={MainNavigation} options={{ headerShown: false }}/>
                <DummyStackNavigation.Screen name="Comment" component={Comment} options={{ headerShown: false , cardStyle:{ backgroundColor: "transparent" }}} />
            </DummyStackNavigation.Navigator>
        </NavigationContainer>
    );
}