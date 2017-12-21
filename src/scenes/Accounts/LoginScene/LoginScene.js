// @flow

import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginContainer } from 'AppContainers';

class LoginScene extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render() {
    return (
        <View style={{ flex: 1 }}>
          <LoginContainer />
        </View>
      );
  }
}

export default LoginScene;
