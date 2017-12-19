// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import { Chat, SendRow } from 'AppComponents';
import { SEND_ROW_DEFAULT_HEIGHT } from 'AppConstants';
import firebase from 'Firebase'; 
import DeviceInfo from 'react-native-device-info'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transform: {
    transform: [{ scaleY: -1 }]
  },
});

class ChatContainer extends Component {
    static propTypes = {
      room: PropTypes.object,
      contacts: PropTypes.array,
      navigator: PropTypes.object,
      user: PropTypes.object,
    };
  
    constructor(props, context) {
      super(props, context);
      this.state = {
        messages: [],
        roomId: props.room ? props.room.messageId : null,
        room: props.room,
        users: props.room ? props.room.users : [],
      };

      this.messagesRef = this.state.roomId ? firebase.messagesRef(this.state.roomId) : null;
      this.sendRowRef = null;

      this.addListeners();
    }

    componentWillUnmount() {
      if (this.messagesRef) {
        this.messagesRef.off('value', this.onMessageChange);
      }
    }

    addListeners = () => {
      if (this.messagesRef) {
        this.messagesRef.on('value', this.onMessageChange);
      }
    };

    getUsers = (room) => {
      if (!room.participants) {
        return Promise.resolve([]);
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

    onMessageChange = (snapshot) => {
      var items = [];
      snapshot.forEach((child) =>
        items.push({ ...child.val(), id: child.key })
      );
      this.setState({ messages: items.reverse() });
    };

    onSendMsg = () => {
      const { room, roomId } = this.state;
      const { user } = this.props;
      const text = this.sendRowRef.getTextInputRef()._getText();
      const msg = {
        created: Date.now(),
        author: user.id,
        text,
      };
      if (this.messagesRef) {
        const newMsgRef = this.messagesRef.push();
        newMsgRef.set(msg);

        if (room) {
          const newRoom = Object.assign({}, room, {
            lastMessage: newMsgRef.key,
            updated: msg.created
          });
          delete newRoom.message;
          delete newRoom.users;
          firebase.roomsRef(room.id).set(newRoom);
        }
        return;
      }
      this.createNewRoom(msg);
    };

    createNewRoom = (message) => {
      const msg = { ...message };
      const { contacts } = this.props;
      const roomsRef = firebase.roomsRef();
      const participants = contacts.map(contact => contact.id);

      participants.push(DeviceInfo.getUniqueID())
      let room = {
        created: Date.now(),
        updated: Date.now(),
        participants,
      };

      const messageRoomRef = firebase.messagesRef().push()
      const messageRef = messageRoomRef.push();
      messageRef.set(msg);

      const newRoomRef = roomsRef.push();
      room.lastMessage = messageRef.key;
      room.messageId = messageRoomRef.key;
      newRoomRef.set(room);
      room.id = newRoomRef.key;
      msg.id = messageRoomRef.key;

      firebase.addRoomIdToUser(newRoomRef.key, contacts);

      this.getUsers(room)
      .then(users => {
        this.setState({ roomId: messageRoomRef.key, room, users }, () => {
          this.messagesRef = this.state.roomId ? firebase.messagesRef(this.state.roomId) : null;
          this.addListeners();
        });
      });
    };

    renderRow = ({ item }) => {
      const isOwn = item.author === this.props.user.id;
      const user = this.state.users.find(user => user.id === item.author);
      return (
        <Chat
          style={styles.transform}
          room={item}
          isOwn={isOwn}
          user={user}
        />
      );
    };

    extractKeys = (item: Object): string => {
      return item.id;
    };

    render() {
      return (
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={'padding'}
            keyboardVerticalOffset={SEND_ROW_DEFAULT_HEIGHT}
          >
            <FlatList
              style={styles.transform}
              data={this.state.messages}
              renderItem={this.renderRow}
              keyExtractor={this.extractKeys}
            />
            <SendRow
              insertMessage={this.onSendMsg}
              ref={ref => this.sendRowRef = ref}
              autoFocus={false}
              onEndEditing={() => null}
            />
          </KeyboardAvoidingView>
        </View>
      );
    }
  }

export default ChatContainer;
