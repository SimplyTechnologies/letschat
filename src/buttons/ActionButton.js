// @flow

import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { DARK_GRAY, BLUE } from 'AppColors';
import { WINDOW_WIDTH, NAVBAR_HEIGHT } from 'AppConstants';
import type { StyleObj } from 'AppTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    width: WINDOW_WIDTH / 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    backgroundColor: 'transparent',
    height: NAVBAR_HEIGHT * 0.87,
    justifyContent: 'center'
  },
  label: {
    fontSize: 16,
    color: DARK_GRAY,
    alignSelf: 'center',
    justifyContent: 'center'
  },
});

type Props = {
  onPress: Function,
  onPressIn?: Function,
  isActive: boolean,
  activeColor: string,
  showActiveBorder: boolean,
  style?: StyleObj,
  labelStyle?: StyleObj,
  label: any,
  upperCase: boolean
}

const emptyFn = () => null;

export function ActionButton({
  isActive,
  showActiveBorder,
  activeColor,
  style,
  label,
  labelStyle,
  upperCase,
  onPress,
  onPressIn,
}: Props) {
  const buttonLabel = upperCase
    ? label.toUpperCase()
    : label;

  const activeBorderStyle = (isActive && showActiveBorder)
    ? { borderColor: activeColor }
    : {};

  const activeLabelStyle = isActive
    ? { color: activeColor }
    : {};

  return (
    <TouchableOpacity
      disabled={!isActive}
      onPressIn={onPressIn ? onPressIn : emptyFn}
      onPress={isActive ? onPress : emptyFn}
      style={[styles.button, activeBorderStyle, style]}
    >
      <View style={styles.container}>
        <Text style={[styles.label, activeLabelStyle, labelStyle]}>
            {buttonLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ActionButton.defaultProps = {
  isActive: true,
  activeColor: BLUE,
  upperCase: true,
  showActiveBorder: true
};
