import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
    .then(() => firebase.getOwnUser())
    .then((user) => {
      if (user) {
        return startApp({ user });
      }
      return startLoginScene();
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
