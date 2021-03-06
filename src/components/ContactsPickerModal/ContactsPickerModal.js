// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  Modal
} from 'react-native';
import { Contact } from './Contact';
import { WINDOW_WIDTH, NAVBAR_HEIGHT } from 'AppConstants';
import { requestContactsPermission, getContacts } from 'AppUtilities';
import { BACKGROUND_GRAY, HUE_GRAY } from 'AppColors';
import { isEmpty } from 'lodash';

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_GRAY,
  },
  row: {
    width: WINDOW_WIDTH,
    height: 60,
  },
  list: {
    backgroundColor: 'transparent',
  },
  navbar: {
    width: WINDOW_WIDTH,
    height: NAVBAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: HUE_GRAY,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    padding: 5,
    marginRight: 8,
  },
  text: {
    color: 'black',
  },
});

type ContactType = {
  phoneNumbers: Array<{
    number: string
  }>,
  givenName: string,
  recordID: string
};

type SContactType = {
	name: $PropertyType<ContactType, 'givenName'>,
	phone: ?string,
	id: $PropertyType<ContactType, 'recordID'>,
	selected: boolean
};

type State = {
  contacts: Array<SContactType>
};

type Props = {
  visible: ?boolean,
  onDone: (arg: $PropertyType<State, 'contacts'>) => void,
  onCancel: () => void
};

class ContactsPickerModal extends Component<Props, State> {
	contacts: Array<SContactType>;

    constructor(props: Props, context: mixed) {
      super(props, context);
      this.state = {
        contacts: [],
      };

      this.contacts = [];
    }

    componentWillReceiveProps(nextProps: Props) {
      if (nextProps.visible && !this.props.visible) {
        this.getContacts();
      }
    }

    getContacts = () => {
      if (!isEmpty(this.contacts)) {
        return;
      }
      requestContactsPermission()
        .then(() => getContacts())
        .then(contacts => this.setContacts(contacts));
    };

    setContacts = (contacts: Array<ContactType> = []) => {
      this.contacts = contacts.map(contact => {
        const phone = !isEmpty(contact.phoneNumbers)
          ? contact.phoneNumbers[0].number
          : null;
        return {
          name: contact.givenName,
          phone,
          id: contact.recordID,
          selected: false
        };
      }).filter(contact => !!contact.phone);
      this.setState({ contacts: this.contacts });
    };

    onContactPress = (item: SContactType) => {
      this.contacts = this.contacts.map(contact => {
        if (contact.id === item.id) {
          contact.selected = !contact.selected;
        }
        return contact;
      })
      this.setState({ contacts: this.contacts });
    };

    onDone = () => {
      const contacts = this.contacts.filter(contact => !!contact.selected);
      this.contacts = [];
      this.props.onDone(contacts);
    };

    onCancel = () => {
      this.contacts = [];
      this.props.onCancel();
    };

    extractKeys = (item: SContactType) => {
      return item.id;
    };

    renderRow = ({ item }: { item: SContactType }) => {
      return (
        <Contact
          contact={item}
          onPress={this.onContactPress}
        />
      );
    };

    renderNavBar = () => {
      return (
        <View style={styles.navbar} >
          <TouchableOpacity style={styles.button} onPress={this.onCancel} >
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity >
          <TouchableOpacity style={styles.button} onPress={this.onDone} >
            <Text style={styles.text}>Done</Text>
          </TouchableOpacity >
        </View >
      );
    };

    render() {
      const { contacts } = this.state;
      const { visible } = this.props;

      return (
        <Modal
          visible={visible}
          animationType={'slide'}
          onRequestClose={() => null}
        >
          <View style={styles.container} >
            {this.renderNavBar()}
            <FlatList
              data={contacts}
              renderItem={this.renderRow}
              keyExtractor={this.extractKeys}
              style={styles.list}
            />
          </View>
        </Modal>
      );
    }
  }
  
  export default ContactsPickerModal;
