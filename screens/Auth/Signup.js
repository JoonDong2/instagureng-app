import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import {Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Auth } from "aws-amplify";
import Loader from "../../components/Loader";
import { StackActions } from "@react-navigation/native";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fff;
`;

export default ({ route, navigation }) => {
  const firstNameInput = useInput("");
  const lastNameInput = useInput("");
  const emailInput = useInput(route.params !== undefined ? route.params.email : "");
  const userNameInput = useInput("");
  const passwordInput = useInput("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const { value: email } = emailInput;
    const { value: firstName } = firstNameInput;
    const { value: lastName } = lastNameInput;
    const { value: userName } = userNameInput;
    const { value: password } = passwordInput;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      return Alert.alert("That email is invalid");
    }
    if (firstName === "") {
      return Alert.alert("First name required");
    }
    if (lastName === "") {
      return Alert.alert("Last name required");
    }
    if (userName === "") {
      return Alert.alert("Invalid username");
    }
    if (password === "") {
      return Alert.alert("패스워드를 입력해 주세요.");
    }
    
    try {
      setLoading(true);
      await Auth.signUp({
        password: password,
        username: userName ,
        attributes: {
            email: email,
            given_name: firstName,
            family_name: lastName,
        }
      });
      //navigation.navigate("Confirm", { userName, password });
      navigation.dispatch(StackActions.replace("Confirm", { userName, password, fromLogin: false }));

    } catch (e) {
      console.log(e);
      if(e.code === "InvalidParameterException" && e.message.includes("password")) {
        return Alert.alert("Invalid password\r\n최소 6자 이상의 패스워드를 입력해 주세요.");
      } else if(e.code === "UserLambdaValidationException" && e.message.includes("EmailExistError")) {
        return Alert.alert("동일한 이메일이 존재합니다.");
      }else if(e.code === "UserLambdaValidationException" && e.message.includes("UserNameExistError")) {
        return Alert.alert("동일한 사용자 이름이 존재합니다.");
      } else {
        return Alert.alert("알수 없는 오류가 발생하였습니다.");
      }

    } finally {
      setLoading(false);
    }
  };

  if(loading === true) {
    return <Loader/>
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...firstNameInput}
          placeholder="First name"
          autoCapitalize="words"
        />
        <AuthInput
          {...lastNameInput}
          placeholder="Last name"
          autoCapitalize="words"
        />
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...userNameInput}
          placeholder="Username"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...passwordInput}
          placeholder="password"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <AuthButton loading={loading} onPress={handleSignup} text="Sign up" />
      </View>
    </TouchableWithoutFeedback>
  );
};