import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { startLoginScene, startApp } from 'AppNavigator';
import firebase from 'Firebase'; 

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

class SplashScreen extends Component {

  componentWillMount() {
    firebase.isAuthenticated()
    .then(() => {
      AsyncStorage.getItem('user')
      .then(user => {
        startApp({ user: JSON.parse(user) });
      });
    })
    .catch(() => startLoginScene());
  }

  render() {
    return (
      <View style={styles.container} />
    );
  }
}

export default SplashScreen;
