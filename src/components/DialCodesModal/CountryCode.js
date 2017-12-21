import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { HUE_GRAY } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    overflow: 'visible',
    width: WINDOW_WIDTH,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY ,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    marginLeft: 10,
  },
  code: {
    marginRight: 10,
  },
});

export function CountryCode({
    style,
    country,
    onPress,
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(country)} >
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {country.name}
          </Text>
          <Text style={styles.code} numberOfLines={1}>
            {country.code}
          </Text>
        </View>
    </TouchableOpacity>
  );
};

CountryCode.propTypes = {
  country: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};
