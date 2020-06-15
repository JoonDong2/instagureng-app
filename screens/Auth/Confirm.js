import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";
import styles from "../../styles";


const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fff;
`;

export default ({ route, navigation }) => {
  const confirmInput = useInput("");
  const { userName, password, fromLogin } = route.params;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const { value } = confirmInput;
    
    if(value === "") {
      return Alert.alert("Invalid scret");
    }

    try {
      setLoading(true);
      await Auth.confirmSignUp(userName, value);
      Alert.alert("인증이 완료되었습니다.");
      navigation.navigate("Login", {userName: userName, password: password, updateRequired: !fromLogin});
    } catch (e) {
      console.log(e);
      Alert.alert("Can't confirm secret");
    } finally {
      setLoading(false);
    }
  }

  const resendConfirmationCode = async (userName) => {
    try {
        await Auth.resendSignUp(userName);
        Alert.alert("인증 코드를 다시 전송했습니다.")
        console.log('code resent succesfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...confirmInput}
          placeholder="Secret"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleConfirm} text="Confirm"/>
        <TouchableOpacity onPress={() => resendConfirmationCode(userName)}>
          <Text style={{color: styles.blueColor}}>인증코드 재전송</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};