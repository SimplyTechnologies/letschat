import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet, Text } from 'react-native';
import { GRAY } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import moment from 'moment';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
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
  text: {
    color: 'red',
  },
  title: {
    color: 'blue',
  },
  right: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  left: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  message: {
    backgroundColor: 'lightblue',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    flexDirection: 'column',
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  messageLeft: {
    borderBottomRightRadius: 10,
  },
  messageRight: {
    borderBottomLeftRadius: 10,
  },
  date: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
    marginLeft: 10,
  },
  ownDate: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
    marginRight: 10,
  },
  arrowRight: {
    width: 20,
    height: 10,
    tintColor: 'lightblue',
    alignSelf: 'flex-end',
    marginLeft: -5,
    marginRight: 5,
  },
  arrowLeft: {
    width: 20,
    height: 10,
    tintColor: 'lightblue',
    alignSelf: 'flex-end',
    marginLeft: 5,
    marginRight: -5,
    transform: [{ scaleX: -1 }]
  },
});

export function Chat({
    style,
    room,
    isOwn,
    user,
}) {
  const title = (isOwn ? '' : user.name) + ' ' + moment(room.time).from(Date.now());
  return (
    <View style={[styles.container, styles.margin, style]} >
      <Text style={[isOwn ? styles.ownDate : styles.date]} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={[styles.messageContainer, isOwn ? styles.right: styles.left]}
      >
        {!isOwn && (
          <Image
            resizeMode={'contain'}
            style={styles.arrowLeft}
            source={require('img/message/triangle.png')}
          />
        )}
        <View style={[styles.message, isOwn ? styles.messageRight: styles.messageLeft]}>
          <Text style={styles.text}>
            {room.text}
          </Text>
        </View>
        {isOwn && (
          <Image
            resizeMode={'contain'}
            style={styles.arrowRight}
            source={require('img/message/triangle.png')}
          />
        )}
      </View>
    </View>
  );
};

Chat.propTypes = {
  style: PropTypes.any,
  room: PropTypes.object.isRequired,
  isOwn: PropTypes.bool,
  user: PropTypes.object,
};
