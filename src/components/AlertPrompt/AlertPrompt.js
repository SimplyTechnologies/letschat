// @flow

import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { WINDOW_WIDTH } from 'AppConstants';
import { LIGHT_BLUE, LIGHT_GRAY, GRAY } from 'AppColors';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

type Props = {
  onCancel: () => void,
  onSubmit: (code: string) => void,
  cancelText: ?string,
  submitText: ?string,
  title: ?string,
  message: ?string,
  visible: boolean
};

const height = WINDOW_WIDTH * 0.4;
const width = WINDOW_WIDTH * 0.75;

const styles = StyleSheet.create({
  promtContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opacity: {
    backgroundColor: 'black',
    opacity: 0.2,
  },
  prompt: {
    width,
    height,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 3,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 3,
  },
  input: {
    height: height / 4,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    position: 'absolute',
    bottom: height / 4 + 10,
    left: 10,
    right: 10,
  },
  alertButtons: {
    borderTopWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: height / 4,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: height / 2,
    width: 1,
    backgroundColor: 'gray',
  }
});

class AlertPrompt extends React.Component<Props, void> {
  inputRef: ?TextInput;
  text: string;

  constructor(props: Props, context: mixed) {
    super(props, context);

    this.inputRef = null;
    this.text = '';
  }

  onChangeText = (text: string) => {
    this.text = text;
  };

  handleCancelPress = () => {
    dismissKeyboard();
    this.props.onCancel();
  };

  handleDonePress = () => {
    dismissKeyboard();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.text);
    }
    if (this.inputRef) {
      this.inputRef.clear();
    }
  };

  render() {
    const { visible } = this.props;
    if (!visible) {
        return null;
    }

    const { title, message, submitText, cancelText } = this.props;

    const submit = submitText ? submitText : 'Ok';
    const cancel = cancelText ? cancelText : 'Cancel';

    return (
        <View style={styles.promtContainer} >
          <View style={[styles.promtContainer, styles.opacity]} />
          <View style={styles.prompt}>
            {title && (<Text style={styles.title}>{title}</Text>)}
            {message && (<Text style={styles.text}>{message}</Text>)}
            <TextInput
              ref={ref => this.inputRef = ref}
              autoCorrect={false}
              editable={true}
              style={[styles.input]}
              underlineColorAndroid={'transparent'}
              autoFocus={true}
              onChangeText={(text) => this.text = text}
            />
            <View style={styles.alertButtons} >
              <TouchableOpacity style={styles.button} onPress={this.handleCancelPress} >
                <Text>{cancel}</Text>
              </TouchableOpacity>
              <View style={styles.bar} />
              <TouchableOpacity style={styles.button} onPress={this.handleDonePress}>
                <Text>{submit}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
  }
}

export default AlertPrompt;
