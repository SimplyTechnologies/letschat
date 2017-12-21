import React from 'react';
import { ActivityIndicator } from 'react-native';

export function Loading(props) {
  return (
    <ActivityIndicator {...props} />
  );
}

Loading.propTypes = {
  ...ActivityIndicator.propTypes,
};

Loading.defaultProps = {
  size: 'large',
  animating: true,
};
