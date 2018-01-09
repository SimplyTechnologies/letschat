
// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  FlatList,
  AlertIOS,
  Platform,
} from 'react-native';
import { Message, ContactsPickerModal } from 'AppComponents';
import { WINDOW_WIDTH } from 'AppConstants';
import type { Contact } from 'AppConstants';
import ContactsWrapper from 'react-native-contacts-wrapper';
import firebase from 'Firebase'; 
import { startLoginScene } from 'AppNavigator';
import { getTitleFromUsers } from 'AppUtilities';
import { BACKGROUND_GRAY } from 'AppColors';
import { isEmpty, xor } from 'lodash';
import type { User, Message as MessageType, Room, NavigationEvent, FirebaseSnapshot } from 'AppTypes';

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
  }
});

type Props = {
  navigator: any,
  user: User
};
type State = {
  messages: Array<MessageType>,
  user: User | {},
  isModalVisible: boolean
};

class MessageContainer extends React.Component<Props, State> {
    messages: Array<MessageType>;
    userRef: any;
    roomRefs: Array<*>;
    isRequestingContacts: boolean;
    selectedContacts: Array<Contact>

    constructor(props, context) {
      super(props, context);
      this.state = {
        messages: [],
        user: props.user || { },
        isModalVisible: false,
      };
      this.messages = [];
      this.userRef = firebase.usersRef(this.state.user.id);
      this.roomRefs = [];
      this.isRequestingContacts = false;
      this.selectedContacts = [];
    }

    componentWillMount() {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

      firebase.getUserByPhoneNumber(this.state.user.phone)
      .then(user => {
        this.setState({ user: user || this.state.user });
        return this.getInitialRooms(user);
      })
      .catch((err) => {
        console.warn('Error retrieving rooms', err);
      })
      .finally(() => this.addUserListener());
    }

    componentWillUnmount() {
      if (this.userRef) {
        this.userRef.off('value', this.onUserChange);
      }
      this.roomRefs.forEach(ref => {
        ref.roomRef.off();
      });
    }

    onNavigatorEvent = (event: NavigationEvent) => {
      switch (event.type) {
      case 'NavBarButtonPress':
        if (event.id === 'add') {
          this.showContactsModal();
          return
        }
        if (event.id === 'cancel') {
          firebase.signOut();
          startLoginScene();
        }
        break;
      case 'ScreenChangedEvent':
        if (event.id === 'didAppear' && this.isRequestingContacts && isIOS) {
          this.startChatIfNeeded(this.selectedContacts);
          this.isRequestingContacts = false;
        }
        break;
      default:
        break;
      }
    };

    addUserListener = () => {
      this.userRef.on('value', this.onUserChange);
    };

    getInitialRooms = (user: User) => {
      if (!user.roomIds) {
        return Promise.resolve();
      }

      const roomIds = Object.keys(user.roomIds);
      const promises = [];

      roomIds.forEach(roomId => {
        const ref = { id: roomId, roomRef: firebase.roomsRef(roomId) };
        const promise = new Promise((resolve, reject) => {
          ref.roomRef.once('value', (snapshot) => {
            const val = snapshot.val();
            if (!val) {
              return resolve(null);
            }
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


      return Promise.all(promises)
      .then(rooms => {
        this.setMessages(rooms.filter(room => !!room));
      });
    };

    addRoomListener = (roomId: string) => {
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

    updateRoomIfNeeded = (snapshot: FirebaseSnapshot) => {
      const val = snapshot.val();      
      if (!val) { // Room has been removed.
        const roomId = snapshot.key;
        this.messages = this.messages.filter(room => room.id !== roomId);
        return this.setState({ messages: Object.assign([], this.messages)});
      }

      const existingRoom = this.messages.find(message => message.id === val.id);
      if (existingRoom) {
        if (!this.isRoomChanged(existingRoom, val)) {
          return;
        }
        return this.getMessageById(val.messageId, val.lastMessage)
        .then(lastMessage => {
          this.messages = this.messages.map(message => {
            if (message.id !== existingRoom.id) {
              return message;
            }
            return Object.assign({}, message, { message: lastMessage, updated: val.updated });
          });
          this.setMessages(this.messages);
        });
      }

      const room = { ...snapshot.val(), id: snapshot.key };
      this.getRoomUsers(room)
      .then(users => room.users = users)
      .then(() => this.getMessageById(room.messageId, room.lastMessage))
      .then(lastMessage => {
        room.message = lastMessage;
        this.messages.push(room);
        this.setMessages(this.messages)
      });
    };

    setMessages = (messages: Array<MessageType>) => {
      this.messages = messages.reduce((prevMessages, message) => {
        if (prevMessages.some(msg => msg.id === message.id)) {
          return prevMessages;
        }
        return prevMessages.concat(message);
      }, [])
      .sort((a, b) => {
        return new Date(b.updated) - new Date(a.updated);
      });
      this.setState({ messages: this.messages });
    };

    isRoomChanged = (oldRoom: Room, newRoom: Room) => {
      return oldRoom.lastMessage !== newRoom.lastMessage;
    };

    getMessageById = (roomId: string, messageId: string) => {
      return new Promise((resolve, reject) => {
        firebase.messagesRef().child(roomId).child(messageId)
        .once('value', snapshot => {
          const val = snapshot.val();
          if (!val) {
            return resolve({});
          }
          return resolve(val);
        });
      });
    };

    getRoomUsers = (room: Room) => {
      if (!room.participants) {
        return Promise.resolve([]);
      }
      const promises = [];
      room.participants.forEach(user => {
        if (user === this.state.user.id) {
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
      const roomIds = Object.keys(user.roomIds);
      const newRooms = roomIds.filter(room => !this.roomRefs.some(_ref => _ref.id === room));
      newRooms.forEach(id => {
        this.addRoomListener(id);
      });
    };

    startChatIfNeeded = (contacts) => {
      if (isEmpty(contacts)) {
        return;
      }
      const notExistinigContacts = [];
      var phoneNumbers = [];
      const existingContacts = [];
      contacts.forEach(contact => {
        if (!contact.phone) {
          notExistinigContacts.push(contact);
          return;
        }
        const phone = contact.phone.replace(/\s/g,'');
        if (phone !== this.props.user.phone) {
          existingContacts.push(contact);
          phoneNumbers.push(phone);
        }
      });

      if (isEmpty(phoneNumbers)) {
        return;
      }

      const promises = [];
      phoneNumbers.forEach(phone => {
        if (phone === this.state.user.phone) {
          return;
        }
        const promise = firebase.getUserByPhoneNumber(phone);
        promises.push(promise);
      });
      Promise.all(promises)
      .then(users => {
        users.forEach((user, index) => {
          if (!user) {
            notExistinigContacts.push(existingContacts[index]);
          }
        });
        if (isEmpty(notExistinigContacts)) {
          const title = getTitleFromUsers(users.map(user => user.name));
          const room = this.checkIfChatExists(users);
          if (!room) {
            return this.routeToChat(title, { contacts: users, user: this.state.user });
          }
          return this.onMessagePress(room);
        }

        AlertIOS.alert(
          notExistinigContacts.length === 1 ? 'User does not exist' : 'Users does not exist',
          getTitleFromUsers(notExistinigContacts.map(user => user.name)),
          [{ text: 'Ok', style: 'cancel' }]
        );
      })
      .catch(err => console.warn('Error checking contacts', err));
    };

    checkIfChatExists = (users) => {
      const contains = (participants, _users) => (
        isEmpty(xor(participants, _users))
      );

      var existingRoom = null;
      this.messages.forEach(room => {
        const participants = room.participants.filter(par => par !== this.state.user.id);
        const _users = users.map(user => user.id);
        if (contains(participants, _users)) {
          existingRoom = room;
        }
      });
      return existingRoom;
    };

    showContactsModal = () => {
      if (!isIOS) {
        return this.setState({ isModalVisible: true });
      }

      this.isRequestingContacts = true;
      ContactsWrapper.getContact()
      .then((contacts) => {
        this.selectedContacts = contacts;
      })
      .catch(err => {
        this.isRequestingContacts = false;
      });
    };

    onMessagePress = (item) => {
      const title = getTitleFromUsers(item.users.map(user => user.name));
      this.routeToChat(title, { room: item, user: this.state.user });
    };

    routeToChat = (title: string, passProps: {}) => {
      this.props.navigator.push({
        screen: 'app.ChatScene',
        title,
        passProps,
        animated: true,
        backButtonHidden: false,
        backButtonTitle: '',
      });
    };

    onContactsSelect = (contacts: Array<Contact> = []) => {
      this.setState({ isModalVisible: false }, () => this.startChatIfNeeded(contacts));
    };

    onModalClose = () => {
      this.setState({ isModalVisible: false });
    };

    renderRow = ({ item }: { item: MEssage }) => {
      const title = getTitleFromUsers(item.users.map(user => user.name));
      return (
        <Message
          room={item}
          onPress={this.onMessagePress}
          title={title}
        />
      );
    };

    extractKeys = (item: Message): string => {
      return item.id;
    };

    render() {
      const { messages, isModalVisible } = this.state;

      return (
        <View style={styles.container} >
          <FlatList
            data={messages}
            renderItem={this.renderRow}
            keyExtractor={this.extractKeys}
            style={styles.list}
          />
          {!isIOS && (
            <ContactsPickerModal
              visible={isModalVisible}
              onCancel={this.onModalClose}
              onDone={this.onContactsSelect}
            />
          )}
        </View>
      );
    }
  }
  
  export default MessageContainer;
