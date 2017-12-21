import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { GRAY, WHITE, HUE_GRAY } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: WINDOW_WIDTH,
    backgroundColor: WHITE,
    borderBottomColor: HUE_GRAY,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  lastMessage: {
    color: GRAY,
    fontSize: 14,
    lineHeight: 23,
  },
  title: {
    color: 'blue',
    fontSize: 11,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  }
});

export function Message({
    room,
    onPress,
    title
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(room)} >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.lastMessage} numberOfLines={2}>{room.message.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

Message.propTypes = {
  room: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  title: PropTypes.string,
};
