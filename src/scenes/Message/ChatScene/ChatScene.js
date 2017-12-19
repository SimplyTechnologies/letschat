import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChatContainer } from 'AppContainers';

class ChatScene extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    room: PropTypes.object,
    contacts: PropTypes.array,
    user: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { navigator, room, contacts, user } = this.props;

    return (
      <ChatContainer
        room={room}
        navigator={navigator}
        contacts={contacts}
        user={user}
      />
    );
  }
}

export default ChatScene;
