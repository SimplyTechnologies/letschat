import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import { GRAY, GREEN, WHITE, HUE_GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginLeft: 15,
  },
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FFF',
    overflow: 'visible',
    width: WINDOW_WIDTH,
  },
  margin: {
    marginVertical: 10,
  },
  center: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
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
 }
});

export function CountryCode({
    style,
    country,
    onPress,
}) {
  return (
    <TouchableWithoutFeedback
      style={[styles.container, styles.margin]}
    >
      <View style={[styles.flex, {borderBottomWidth: 1, borderBottomColor: HUE_GRAY }]}>
        <TouchableOpacity
          style={[styles.flex, styles.row, styles.margin]}
          onPress={() => onPress(country)}
        >
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {country.name}
            </Text>
            <Text style={styles.code} numberOfLines={1}>
              {country.code}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

CountryCode.propTypes = {
  country: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};
