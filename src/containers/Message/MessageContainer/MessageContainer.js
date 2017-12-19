
// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  FlatList,
  AlertIOS,
} from 'react-native';
import { Message } from 'AppComponents';
import { WINDOW_WIDTH } from 'AppConstants';
import ContactsWrapper from 'react-native-contacts-wrapper';
import firebase from 'Firebase'; 
import { startLoginScene } from 'AppNavigator';
import { getTitleFromUsers } from 'AppUtilities';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  row: {
    width: WINDOW_WIDTH,
    height: 60,
  }
});

class MessageContainer extends Component {
    static propTypes = {
      navigator: PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);
      this.state = {
        messages: [],
        user: props.user || { },
      };
      this.messages = [];
      this.userRef = firebase.userRef();
      this.roomRefs = [];
      this.getInitialRooms();
    }

    componentWillMount() {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentWillUnmount() {
      if (this.userRef) {
        this.userRef.off('value', this.onUserChange);
      }
      this.roomRefs.forEach(ref => {
        ref.roomRef.off();
      });
    }

    addUserListener = () => {
      this.userRef.on('value', this.onUserChange);
    };

    getInitialRooms = () => {
      firebase.getOwnUser()
      .then(user => {
        this.setState({ user });

        if (!user.roomIds) {
          this.addUserListener();
          return;
        }

        const roomIds = [];
        Object.keys(user.roomIds).forEach(key => roomIds.push(user.roomIds[key]));
        const promises = [];

        roomIds.forEach(roomId => {
          const ref = { id: roomId, roomRef: firebase.roomsRef(roomId) };
          if (this.roomRefs.some(_ref => _ref.id === ref.id)) {
            return;
          }
          this.roomRefs.push(ref);

          const promise = new Promise((resolve, reject) => {
            ref.roomRef.on('value', (snapshot) => {
              const val = snapshot.val();
              const room = { ...snapshot.val(), id: snapshot.key };
              this.getRoomUsers(room)
              .then(users => room.users = users)
              .then(() => this.getMessageById(room.messageId, room.lastMessage))
              .then(lastMessage => {
                room.message = lastMessage;
                return resolve(room);
              });
            });
          });

          promises.push(promise);
        });

        // Now start listening to user's rooms change
        this.addUserListener();

        Promise.all(promises)
        .then(rooms => {
          this.messages = rooms.sort((a, b) => {
            return new Date(b.updated) - new Date(a.updated);
          });
          this.setState({ messages: this.messages });
        });
      })
      .catch((err) => {
        console.warn('Error retrieving rooms', err);
        this.addUserListener();
      });
    };

    addRoomListener = (roomId) => {
      const ref = {
        id: roomId,
        roomRef: firebase.roomsRef(roomId),
      };
      if (this.roomRefs.some(_ref => _ref.id === ref.id)) {
        return;
      }
      this.roomRefs.push(ref);
      ref.roomRef.on('value', this.updateRoomIfNeeded);
    };

    updateRoomIfNeeded = (snapshot) => {
      const val = snapshot.val();
      const existingRoom = this.messages.find(message => message.id === val.id );
      if (existingRoom) {
        return this.getMessageById(val.messageId, val.lastMessage)
        .then(lastMessage => {

          this.messages = this.messages.map(message => {
            if (message.id !== existingRoom.id) {
              return message;
            }
            return Object.assign({}, message, { message: lastMessage, updated: val.updated });
          }).sort((a, b) => {
            return new Date(b.updated) - new Date(a.updated);
          });
          this.setState({ messages: this.messages });
        });
      }

      const room = { ...snapshot.val(), id: snapshot.key };
      this.getRoomUsers(room)
      .then(users => room.users = users)
      .then(() => this.getMessageById(room.messageId, room.lastMessage))
      .then(lastMessage => {
        room.message = lastMessage;
        this.messages.push(room);
        this.messages = this.messages.sort((a, b) => {
          return new Date(b.updated) - new Date(a.updated);
        });
        this.setState({ messages: this.messages });
      });
    };

    getMessageById = (roomId, messageId) => {
      return new Promise((resolve) => {
        firebase.messagesRef().child(roomId).child(messageId)
        .once('value', snapshot => {
          return resolve(snapshot.val());
        });
      });
    };

    getRoomUsers = (room) => {
      if (!room.participants) {
        return;
      }
      const promises = [];
      room.participants.forEach(user => {
        if (user === this.props.user.id) {
          return;
        }
        const promise = new Promise((resolve, reject) => {
          firebase.usersRef(user).once('value', (snapshot) => {
            const val = snapshot.val();
            if (!val) {
              return reject();
            }
            return resolve({ ...val, id: snapshot.key });
          });
        });
        promises.push(promise);
      });
      return Promise.all(promises)
    };

    onUserChange = (snapshot) => {
      const user = { ...snapshot.val(), id: snapshot.key };

      this.setState({ user });
      if (!user.roomIds) {
        return;
      }
      const roomIds = [];
      Object.keys(user.roomIds).forEach(key => roomIds.push(user.roomIds[key]));
      const newRooms = roomIds.filter(room => !this.roomRefs.some(_ref => _ref.id === room));
      newRooms.forEach(id => {
        this.addRoomListener(id);
      });
    };

    onNavigatorEvent = (event) => {
      if (event.type === 'NavBarButtonPress') {        
        if (event.id === 'add') {
          return this.showContactsModal();
        }
        if (event.id === 'cancel') {
          firebase.signOut();
          startLoginScene();
        }
      }
    };

    startChatIfNeeded = (contacts) => {
      if (!contacts) {
        return;
      }
      const notExistinigContacts = [];
      const phoneNumbers = [];
      const existingContacts = [];
      contacts.forEach(contact => {
        if (!contact.phone) {
          notExistinigContacts.push(contact);
          return;
        }
        existingContacts.push(contact);
        phoneNumbers.push(contact.phone.replace(/\s/g,''));
      });

      const promises = [];
      phoneNumbers.forEach(phone => {
        const promise = firebase.checkUserExists(phone);
        promises.push(promise);
      });
      Promise.all(promises)
      .then(users => {
        users.forEach((user, index) => {
          if (!user) {
            notExistinigContacts.push(existingContacts[index]);
          }
        });
        if (notExistinigContacts.length === 0) {
          const title = getTitleFromUsers(users.map(user => user.name));
          return this.routeToChat(title, { contacts: users, user: this.state.user });
        }

        AlertIOS.alert(
          notExistinigContacts.length === 1 ? 'User does not exist' : 'Users does not exist',
          getTitleFromUsers(notExistinigContacts.map(user => user.name)),
          [{ text: 'Ok', style: 'cancel' }]
        );
      })
      .catch(err => console.warn('Error checking contacts', err));
    };

    showContactsModal = () => {
      ContactsWrapper.getContact()
      .then((contacts) => {
        // Since contacts controller is not disappeared yet,
        // this is hack to route new scene properly.
        // TODO fix it on native side.
        setTimeout(() => {
          console.log(contacts);
          if (contacts.length === 0) {
            return;
          }
          this.startChatIfNeeded(contacts);
        }, 1000);
      })
      .catch(err => {
        console.warn('Error selecting contact:', err);
      });
    };

    onMessagePress = (item) => {
      const title = getTitleFromUsers(item.users.map(user => user.name));
      this.routeToChat(title, { room: item, user: this.state.user });
    };

    routeToChat = (title, passProps) => {
      this.props.navigator.push({
        screen: 'app.ChatScene',
        title: title, 
        passProps,
        animated: true,
        backButtonHidden: false,
        backButtonTitle: '',
      });
    };

    renderRow = ({ item }) => {
      const title = getTitleFromUsers(item.users.map(user => user.name));
      return (
        <Message
          style={styles.row}
          room={item}
          onPress={this.onMessagePress}
          title={title}
        />
      );
    };

    extractKeys = (item: Object): string => {
      return item.id;
    };

    render() {
      const { messages } = this.state;

      return (
        <View style={styles.container} >
          <FlatList
            data={messages}
            renderItem={this.renderRow}
            keyExtractor={this.extractKeys}
          />
        </View>
      );
    }
  }
  
  export default MessageContainer;
