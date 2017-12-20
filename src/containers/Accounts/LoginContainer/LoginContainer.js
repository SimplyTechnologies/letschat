// @flow

import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  AlertIOS,
} from 'react-native';
import firebase from 'Firebase'; 
import { Login, DialCodesModal } from 'AppComponents';
import { startApp } from 'AppNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  instructions: {
    height: 20,
  }
});

export class LoginContainer extends React.Component<Props, State> {
  constructor(props: Props, context: mixed) {
    super(props, context);

    this.state = {
      isModalVisible: false,
      selectedCountry: null,
    };

    this.auth = null;
    this.name = null;
    this.phone = null;
  }

  handleSignIn = ({ name, phone }) => {
    const { selectedCountry } = this.state;
    if (!phone || !selectedCountry) {
      return;
    }

    this.phone = `${selectedCountry.code}${phone}`;
    this.name = !!name ? name : this.phone;

    firebase.requestAuthenticationCode(selectedCountry.code, phone)
    .then(res => {
      this.auth = res;
      this.showAlert();
    })
    .catch(err => {
      this.phone = null;
      this.name = null;
      console.warn('Error requesting authentication code:', err);
    });
  }

  showAlert = () => {
    AlertIOS.prompt(
      'Verify',
      'Enter code you received via SMS',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Go',
          onPress: password => this.confirm(password),
        },
      ],
      'plain-text'
    );
  };

  confirm = (code) => {
    if (!this.auth) {
      return;
    }
    this.auth.confirm(code)
    .then(res => {
      const info = {
        name: this.name,
        phone: this.phone,
      };
      firebase.getOwnUser()
      .then(user => {
        if (!user) {
          return firebase.setUserInfo(info)
        }
        const _user = { ... user };
        delete _user.id;
        return firebase.setUserInfo({ ..._user, ...info });
      })
      .then((user) => startApp({ user }));
    })
    .catch(err => {
      console.warn('Error confirming authentication code:', err);
      this.showAlert();
    });
  };

  onCountryCodePress = () => {
    this.setState({ isModalVisible: true });
  };

  onCountryCodeSelect = (country) => {
    this.setState({ selectedCountry: country, isModalVisible: false });
  };

  onModalClose = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { routeSignup, routeLogin, togglePlay } = this.props;
    const { isModalVisible, selectedCountry } = this.state;

    return (
      <View style={styles.container} >
        <KeyboardAvoidingView
          behavior={'position'}
          style={styles.container}
          contentContainerStyle={styles.container}
          keyboardVerticalOffset={-100}
        >
          <Login
            handleSignIn={this.handleSignIn}
            onCountryCodePress={this.onCountryCodePress}
            selectedCountry={selectedCountry}
          />
          <DialCodesModal
            visible={isModalVisible}
            onPress={this.onCountryCodeSelect}
            onClose={this.onModalClose}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}
  