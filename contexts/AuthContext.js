import React, { createContext, useContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import Amplify, { Auth, Hub } from 'aws-amplify';
import aws_exports from "../aws-exports";
Amplify.configure(aws_exports);


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  },[])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useSetIsLoggedIn = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    return setIsLoggedIn;
}