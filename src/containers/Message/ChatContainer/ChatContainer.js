// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  FlatList,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Chat, SendRow, Loading } from 'AppComponents';
import { SEND_ROW_DEFAULT_HEIGHT } from 'AppConstants';
import type { Contact } from 'AppConstants';
import { BACKGROUND_GRAY } from 'AppColors';
import firebase from 'Firebase'; 
import type { User, Room } from 'AppTypes';
import { isEmpty } from 'lodash';

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_GRAY,
  },
  transform: {
    transform: [{ scaleY: -1 }]
  },
  list: {
    backgroundColor: 'transparent',
  },
  loading: {
    marginTop: 10,
  }
});

type Message = {
  author: string,
  text: string,
  created: number
};

type Props = {
  room: ?Room,
  contacts: Array<Contact>,
  navigator: any,
  user: User
};
type State = {
  messages: Array<Message>,
  loading: boolean,
  room: Room & {
    users: Array<User>,
    message: Message
  }
};

class ChatContainer extends Component<Props, State> {
  	messages: Array<Message>;
  	loading: boolean;
  	hasMoreToLoad: boolean;
  	listChunkSize: number;
  	messageRef: any;
  	sendRowRef: SendRow;
  
    constructor(props: Props, context: mixed) {
      super(props, context);
      this.state = {
        messages: [],
        roomId: props.room ? props.room.messageId : null,
        room: props.room,
        users: props.room ? props.room.users : [],
        loading: !!props.room,
      };

      this.messages = [];
      this.messagesRef = this.state.roomId
        ? firebase.messagesRef(this.state.roomId)
        : null;

      this.sendRowRef = null;

      this.loading = false;
      this.hasMoreToLoad = !!props.room;
      this.listChunkSize = 20;
      this.getInitialMessages();
    }

    componentWillUnmount() {
      if (this.messagesRef) {
        this.messagesRef.off();
      }
    }

    addListeners = () => {
      if (!this.messagesRef) {
        return;
      }
      this.messagesRef.on('child_removed', this.onMessageRemoved);
      if (isEmpty(this.messages)) {
        this.messagesRef.on('child_added', this.onMessageAdded);
        return;
      }
      const date = this.state.messages[0].created;
      this.messagesRef.orderByChild('created').startAt(date).on('child_added', this.onMessageAdded);
    };

    onMessageAdded = (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        return;
      }
      const message = { ...val, id: snapshot.key };
      const contains = this.messages.some((msg => msg.id === message.id));
      if (!contains) {
        this.messages.unshift(message);
        this.setState({ messages: Object.assign([], this.messages) });
      }
    };

    onMessageRemoved = (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        return;
      }
      const message = { ...val, id: snapshot.key };
      const contains = this.messages.some((msg => msg.id === message.id));
      if (contains) {
        this.messages = this.messages.filter(msg => msg.id !== message.id);
        this.setState({ messages: this.messages });
      }
    };

    getInitialMessages = () => {
      if (!this.messagesRef) {
        return;
      }
      this.messagesRef.orderByChild('created')
      .limitToLast(this.listChunkSize)
      .once('value', (snapshot) => {
        this.messages = [];
        snapshot.forEach((child) =>
          this.messages.unshift({ ...child.val(), id: child.key })
        );
        this.setState({ messages: this.messages, loading: false });
        this.addListeners();
      });
    };

    getOldMessages = () => {
      if (!this.messagesRef || isEmpty(this.state.messages) || this.loading || !this.hasMoreToLoad) {
        return;
      }
      this.loading = true;
      this.setState({ loading: true });
      const lastMessage = this.state.messages[this.state.messages.length - 1];
      this.messagesRef.orderByChild('created')
      .endAt(lastMessage.created)
      .limitToLast(this.listChunkSize + 1)
      .once('value', (snapshot) => {
        const messages = [];
        snapshot.forEach((child) => {
          messages.unshift({ ...child.val(), id: child.key })
        });

        this.messages = this.messages.concat(messages).reduce((prevMessages, current) => {
          if (prevMessages.some(msg => msg.id === current.id)) {
            return prevMessages;
          }
          return prevMessages.concat(current);
        }, []);

        this.hasMoreToLoad = messages.length > this.listChunkSize;
        this.loading = false;
        this.setState({ messages: this.messages, loading: false });
      });
    };

    getUsers = (room: Room): Promise<Array<User>> => {
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

    createNewRoom = (message: Message) => {
      const msg = { ...message };
      const { contacts } = this.props;
      const roomsRef = firebase.roomsRef();
      const participants = contacts.map(contact => contact.id);

      participants.push(this.props.user.id);
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

      firebase.addRoomIdToUser(newRoomRef.key, participants);

      this.getUsers(room)
      .then(users => {
        this.setState({ roomId: messageRoomRef.key, room, users }, () => {
          this.messagesRef = this.state.roomId ? firebase.messagesRef(this.state.roomId) : null;
          this.addListeners();
        });
      });
    };

    renderFooter = () => {
      const { loading } = this.state;
      return (
        <View >
          {loading && <Loading style={styles.loading} />}
        </View>
      );
    };

    renderRow = ({ item }: { item: Message }) => {
      const isOwn = item.author === this.props.user.id;
      const user = this.state.users.find(user => user.id === item.author);
      return (
        <Chat
          style={styles.transform}
          message={item}
          isOwn={isOwn}
          user={user}
        />
      );
    };

    extractKeys = (item: Message): string => {
      return item.id;
    };

    render() {
      return (
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={'padding'}
            keyboardVerticalOffset={isIOS ? SEND_ROW_DEFAULT_HEIGHT : -600}
          >
            <FlatList
              style={[styles.list, styles.transform]}
              data={this.state.messages}
              renderItem={this.renderRow}
              keyExtractor={this.extractKeys}
              ListFooterComponent={this.renderFooter}
              onEndReached={this.getOldMessages}
              onEndReachedThreshold={0.5}
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
