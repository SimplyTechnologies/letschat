import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TextInput, Platform } from 'react-native';

export class AutoGrowInput extends Component {
  static propTypes = {
    onChangeHeight: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onEndEditing: PropTypes.func,
    minHeight: PropTypes.number.isRequired,
    maxHeight: PropTypes.number,
    style: Text.propTypes.style,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Type here'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      height: props.minHeight,
      maxHeight: props.maxHeight || props.minHeight * 3
    };
    this.inputRef = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value === '' && nextState.height !== nextProps.minHeight) {
      this.setState({ height: nextProps.minHeight });
      this.props.onChangeHeight(nextProps.minHeight);
    }
    return true;
  }

  _getInputRef = () => {
    return this.inputRef;
  }

  _onContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    if (this.state.height < height && height < this.state.maxHeight) {
      this.setState({
        height: height + 6
      });
      this.props.onChangeHeight(height);
    }
    if (this.state.height > height + 6) {
      this.setState({
        height: height + 6
      });
      this.props.onChangeHeight(height);
    }
  }

  _onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  render() {
    const { height: inputHeight } = this.state;
    const height = Platform.OS === 'android'
      ? inputHeight + 10
      : inputHeight;
    return (
      <TextInput
        { ...this.props }
        underlineColorAndroid={'transparent'}
        ref={ref => this.inputRef = ref}
        onEndEditing={() => this.props.onEndEditing()}
        multiline={true}
        placeholder={this.props.placeholder}
        onContentSizeChange={this._onContentSizeChange}
        onFocus={this._onFocus}
        style={[this.props.style, { height }]}
      />
    );
  }
}
