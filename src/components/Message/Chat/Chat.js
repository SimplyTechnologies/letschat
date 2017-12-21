import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet, Text } from 'react-native';
import { GRAY, LIGHT_BLUE, LIGHTER_BLUE } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    width: WINDOW_WIDTH,
  },
  margin: {
    marginVertical: 10,
  },
  text: {
    color: 'black',
  },
  ownText: {
    color: 'white',
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    flexDirection: 'column',
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  messageLeft: {
    borderBottomRightRadius: 10,
    backgroundColor: LIGHTER_BLUE,
  },
  messageRight: {
    borderBottomLeftRadius: 10,
    backgroundColor: LIGHT_BLUE,
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
    tintColor: LIGHT_BLUE,
    alignSelf: 'flex-end',
    marginLeft: -5,
    marginRight: 5,
  },
  arrowLeft: {
    width: 20,
    height: 10,
    tintColor: LIGHTER_BLUE,
    alignSelf: 'flex-end',
    marginLeft: 5,
    marginRight: -5,
    transform: [{ scaleX: -1 }]
  },
});

function renderArrowImage(isLeft) {
  if (isLeft) {
    return (
      <Image
        resizeMode={'contain'}
        style={styles.arrowLeft}
        source={require('img/message/triangle.png')}
      />
    );
  }
  return (
    <Image
      resizeMode={'contain'}
      style={styles.arrowRight}
      source={require('img/message/triangle.png')}
    />
  );
}

export function Chat({
    style,
    message,
    isOwn,
    user,
}) {
  const title = (isOwn ? '' : user.name) + ' ' + moment(message.created).fromNow();
  return (
    <View style={[styles.container, styles.margin, style]} >
      <Text style={[isOwn ? styles.ownDate : styles.date]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.messageContainer, isOwn ? styles.right: styles.left]} >
        {!isOwn && renderArrowImage(true)}
        <View style={[styles.message, isOwn ? styles.messageRight: styles.messageLeft]} >
          <Text style={[isOwn ? styles.ownText : styles.text]}>
            {message.text}
          </Text>
        </View>
        {isOwn && renderArrowImage(false)}
      </View>
    </View>
  );
};

Chat.propTypes = {
  style: PropTypes.any,
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool,
  user: PropTypes.object,
};
