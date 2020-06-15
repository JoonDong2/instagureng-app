import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from './TabNavigation';
import PhotoNavigation from './PhotoNavigation';
import MessageNavigation from './MessageNavigation';
import SinglePost from '../screens/SinglePost';
import NavIcon from '../components/NavIcon';
import UserDetail from '../screens/UserDetail';
import { barStyles } from "./config";
import Comments from '../screens/Comments';

const MainStackNavigation = createStackNavigator();

export default () => {
    return (
        <MainStackNavigation.Navigator headerMode="screen" screenOptions={{headerStyle:{...barStyles}}}>
            <MainStackNavigation.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }}/>
            <MainStackNavigation.Screen name="PhotoNavigation" component={PhotoNavigation} options={{ headerShown: false }}/>
            <MainStackNavigation.Screen name="MessageNavigation" component={MessageNavigation} options={{ headerShown: false }}/>
            <MainStackNavigation.Screen name="Comments" component={Comments}/>
            <MainStackNavigation.Screen 
                name="SinglePost" component={SinglePost}
                options={{
                    headerTitleAlign: "center",
                    headerTitle: () => <NavIcon name="logo-instagram" size={36} />,
                    headerBackTitle: null
                }}
            />
            <MainStackNavigation.Screen name="UserDetail" component={UserDetail} 
                options={{
                    headerTitleAlign: "center",
                }}/>
        </MainStackNavigation.Navigator>
    );
}