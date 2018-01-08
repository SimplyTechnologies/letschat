import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
 } from 'react-native';
 import { GRAY, WHITE, HUE_GRAY, BLUE } from 'AppColors';
 import { WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: WINDOW_WIDTH,
    height: 50,
    backgroundColor: WHITE,
    borderBottomColor: HUE_GRAY,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    color: 'black',
    fontSize: 14,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSelected: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GRAY,
    marginRight: 10,
    backgroundColor: BLUE,
  },
  checkbox: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GRAY,
    marginRight: 10,
    backgroundColor: 'transparent',
  }
});

export function Contact({ contact, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(contact)} >
      <View style={styles.content}>
        <View style={[contact.selected ? styles.checkboxSelected : styles.checkbox]} />
        <Text style={styles.title}>{contact.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

Contact.propTypes = {
  contact: PropTypes.object,
  onPress: PropTypes.func,
};
