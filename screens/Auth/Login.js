import { Auth } from 'aws-amplify';

import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInputV2 from "../../hooks/useInputV2";
import { TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from "react-native";
import styles from '../../styles';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fff;
`;

const SocialContainer = styled.View`
  margin-top: 30px;
  padding-top: 30px;
  border-top-width: 0.5px;
  border-top-color: ${styles.darkGreyColor};
`;

export default ({ route, navigation }) => {
  const updateRequired = route?.params?.updateRequired;
  const userName = route?.params?.userName;
  const password = route?.params?.password;

  const userNameInput = useInputV2("");
  const passwordInput = useInputV2("");
  const [loading, setLoading] = useState(false);

  if(updateRequired === true) {
    userNameInput.setValue(userName);
    passwordInput.setValue(password);
    route.params.updateRequired = false;
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await Auth.signIn(userNameInput.value, passwordInput.value);
      console.log("로그인 성공!");
      //console.log(user);
    } catch (e) {
      console.log(e);
      if(e.code === "UserNotConfirmedException") {
        navigation.navigate("Confirm", { userName: userNameInput.value, password: passwordInput.value, fromLogin: true });
      }
    } finally {
      setLoading(false);
    }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...userNameInput}
          placeholder="User name"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthInput
          {...passwordInput}
          placeholder="password"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
          secureTextEntry={true}
        />
        <AuthButton loading={loading} onPress={handleLogin} text="Log in"/>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{color: styles.blueColor}}>Sign up</Text>
        </TouchableOpacity>
        <SocialContainer>
          <AuthButton style={{marginBottom: 10}} backgroundColor={"#de5246"} onPress={() => Auth.federatedSignIn({provider: 'Google'})} text="Google Login"/>
          {/*<AuthButton style={{marginBottom: 10}} backgroundColor={"#4267B2"} onPress={() => Auth.federatedSignIn({provider: 'Facebook'})} text="Facebook Login"/>*/}
        </SocialContainer>
        
      </View>
    </TouchableWithoutFeedback>
  );
};