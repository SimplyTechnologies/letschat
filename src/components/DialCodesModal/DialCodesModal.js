// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { WINDOW_WIDTH, NAVBAR_HEIGHT, STATUSBAR_HEIGHT, COUNTRIES } from 'AppConstants';
import { HUE_GRAY } from 'AppColors';
import { CountryCode } from './CountryCode';
import ContactsWrapper from 'react-native-contacts-wrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    width: WINDOW_WIDTH,
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY
  },
  navbar: {
    width: WINDOW_WIDTH,
    height: NAVBAR_HEIGHT + STATUSBAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  closeButton: {
    padding: 5,
    marginRight: 8,
    marginTop: STATUSBAR_HEIGHT,
  }
});

class DialCodesModal extends Component {
    static propTypes = {
      navigator: PropTypes.object,
      onPress: PropTypes.func,
      onClose: PropTypes.func,
    };

    onClose = () => {
      this.props.onClose();
    };

    renderRow = ({ item }) => {
      return (
        <CountryCode
          country={item}
          onPress={this.props.onPress}
        />
      );
    };

    extractKeys = (item: Object): string => {
      return `${item.name}${item.code}`;
    };

    render() {
      const { visible } = this.props;
      return (
        <Modal
          visible={visible}
          animationType={'slide'}
        >
          <View style={styles.container} >
            <View style={styles.navbar} >
              <TouchableOpacity style={styles.closeButton} onPress={this.onClose} >
                <Text>Close</Text>
              </TouchableOpacity >
            </View >
            <FlatList
              data={COUNTRIES}
              renderItem={this.renderRow}
              keyExtractor={this.extractKeys}
            />
          </View>
        </Modal>
      );
    }
  }
  
  export default DialCodesModal;
  