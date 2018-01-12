// @flow

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginContainer } from 'AppContainers';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});

const LoginScene = () => (
  <View style={styles.flex}>
    <LoginContainer />
  </View>
)

export default LoginScene;
