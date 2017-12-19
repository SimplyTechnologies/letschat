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
    backgroundColor: 'white',
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
  lastMessage: {
    color: GRAY,
    fontSize: 14,
    lineHeight: 23,
  },
  lastMessageView: {
    flex: 1
  },
  title: {
    color: 'blue',
  },
  content: {
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY,
    paddingLeft: 15,
    backgroundColor: 'white',
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
