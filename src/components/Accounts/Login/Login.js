// @flow

import * as React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { NAVBAR_HEIGHT, WINDOW_WIDTH } from 'AppConstants';
import { ActionButton } from 'AppButtons';
import { BLUE, LIGHT_GRAY, GRAY } from 'AppColors';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

type Props = {
  routeForgotPassword: Function,
  feathers: Function,
  togglePlay: Function,
  onCountryCodePress: Function,
  selectedCountry: object,
  handleSignIn: (code: string) => void,
}

type State = {
  username: string,
  password: string,
  wrongPassword: boolean,
  wrongUsername: boolean,
  validatedUsername: boolean,
}

const ANIMATION_DURATION = 600;
const ANIMATE_OUT_DURATION = 600;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: LIGHT_GRAY,
        textAlign: 'center',
    },
    button: {
        width: WINDOW_WIDTH * 3 / 4,
        height: 50,
        borderRadius: 25,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: GRAY,
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
});

export class Login extends React.Component<Props, State> {

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
  }

  handleSignInPress = () => {
    const data = {
      name: this.name,
      phone: this.phone
    };
    this.props.handleSignIn(data);
  }

  render() {
    const { selectedCountry, onCountryCodePress } = this.props;

    const phone = !!selectedCountry
    ? selectedCountry.code + ' ' + selectedCountry.name
    : '';

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            onChangeText={text => this.onChangeText(text, 0)}
            placeholder="name"
            placeholderTextColor={GRAY}
            style={[styles.input, styles.button]}
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
          />
          <ActionButton
            label="SIGN IN"
            labelStyle={{ color: 'white' }}
            isActive = {true}
            onPress={this.handleSignInPress}
            style={[styles.button, { backgroundColor: BLUE }]}
        />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
