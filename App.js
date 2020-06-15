import React, { useState, useEffect } from 'react';
import { View, Text,  AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from "expo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import apolloClientOptions from "./apollo";
import styles from "./styles";
import { ThemeProvider } from 'styled-components';
import NavController from "./components/NavController";
import Amplify, { Auth, Hub } from 'aws-amplify';
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const preLoad = async () => {
    try {
      await Asset.loadAsync([require("./assets/logo.svg")]);

      // Preloading Apollo Data
      const cache = new InMemoryCache();
      await persistCache({
        cache: cache,
        storage: AsyncStorage
      });

      const client = new ApolloClient({
        cache: cache,
        request: async operation => {
          const token = (await Auth.currentAuthenticatedUser()).signInUserSession.idToken.jwtToken;
          //Alert.alert(token)
          return operation.setContext({
            headers: { authorization: `${token}` }
          });
        },
        ...apolloClientOptions
      });

      setClient(client);
      setLoaded(true);

    } catch(e) {
      console.log(e);
    }
  };

  const authenticate = async () => {
    // Check Login State
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log("인증 정보 가져오기 성공!")
      setIsLoggedIn(true);
    } catch (e) {
      setIsLoggedIn(false);
      console.log('인증정보 가져오기 오류: ')
      console.log(e)
    }
  }

  useEffect(() => {
    preLoad();

    Hub.listen('auth', (data) => {
      const { payload } = data
      //console.log('A new auth event has happened: ', data)
       if (payload.event === 'signIn') {
         //console.log('a user has signed in!');
         setIsLoggedIn(true);
       }
       if (payload.event === 'signOut') {
         //console.log('a user has signed out!')
         setIsLoggedIn(false);
       }
    });

    authenticate();

    return () => {}
  }, []);

  return loaded && client !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
          <NavController isLoggedIn={isLoggedIn}/>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}