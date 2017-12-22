// @flow

import * as React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { ActionButton } from 'AppButtons';
import { LIGHT_BLUE, LIGHT_GRAY, GRAY } from 'AppColors';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

type Props = {
  onCountryCodePress: Function,
  selectedCountry: object,
  handleSignIn: (code: string) => void,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: LIGHT_GRAY,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    width: WINDOW_WIDTH * 3 / 4,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: GRAY,
  },
  signInButton: {
    width: WINDOW_WIDTH * 3 / 4,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 1,
    backgroundColor: LIGHT_BLUE,
  },
  countryButton: {
    width: WINDOW_WIDTH * 3 / 4,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GRAY,
  },
  contryInput: {
    width: WINDOW_WIDTH * 3 / 4,
    height: 50,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
  signInLabel: {
    color: 'white',
    fontWeight: 'bold',
  }
});

class Login extends React.Component<Props, State> {

  constructor(props: Props, context: mixed) {
    super(props, context);

    this.phone = null;
    this.name = null;
  }

  onChangeText = (text, index) => {
    switch (index) {
      case 0:
        this.name = text;
        break;
      case 1:
        this.phone = text;
        break;
      default:
        break;
    }
  };

  handleSignInPress = () => {
    const data = {
      name: this.name,
      phone: this.phone
    };
    this.props.handleSignIn(data);
  };

  render() {
    const { selectedCountry, onCountryCodePress } = this.props;

    const phone = !!selectedCountry
    ? selectedCountry.code + ' ' + selectedCountry.name
    : '';

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
            onChangeText={text => this.onChangeText(text, 0)}
            placeholder="name"
            placeholderTextColor={GRAY}
            style={[styles.input, styles.button]}
            underlineColorAndroid={'transparent'}
          />
          <TouchableOpacity style={styles.countryButton} onPress={onCountryCodePress}>
            <View style={styles.flex} pointerEvents={'box-only'} >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                keyboardType="email-address"
                placeholder="phone code"
                placeholderTextColor={GRAY}
                style={styles.contryInput}
                value={phone}
                underlineColorAndroid={'transparent'}
              />
            </View >
          </TouchableOpacity>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            keyboardType="numeric"
            onChangeText={text => this.onChangeText(text, 1)}
            placeholder="phone number"
            placeholderTextColor={GRAY}
            style={[styles.input, styles.button]}
            underlineColorAndroid={'transparent'}
          />
          <ActionButton
            label="SIGN IN"
            labelStyle={styles.signInLabel}
            isActive = {true}
            onPress={this.handleSignInPress}
            style={styles.signInButton}
        />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Login;
