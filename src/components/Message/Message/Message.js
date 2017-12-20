import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { GRAY, WHITE, HUE_GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: WHITE,
    overflow: 'visible',
    width: WINDOW_WIDTH,
  },
  margin: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
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
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY,
    paddingLeft: 15,
    backgroundColor: WHITE,
  }
});

export function Message({
    style,
    room,
    onPress,
    title
}) {
  return (
    <TouchableWithoutFeedback
      style={[styles.container, styles.margin]}
    >
      <View style={[styles.flex, styles.content]}>
        <TouchableOpacity
          style={[styles.flex, styles.row, styles.margin]}
          onPress={() => onPress(room)}
        >
          <View style={[styles.flex, styles.column]}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {room.message.text}
              </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

Message.propTypes = {
  room: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  title: PropTypes.string,
};
