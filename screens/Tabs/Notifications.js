import React from "react";
import styled from "styled-components";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fff;
`;

const Text = styled.Text``;

export default () => (
  <View>
    <Text>Notifications</Text>
  </View>
);