// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChatContainer } from 'AppContainers';
import type { User, Room } from 'AppTypes';
import type { Contact } from 'AppConstants';

type Props = {
  navigator: any,
  room: Room,
  contacts: Array<Contact>,
  user: User
};

class ChatScene extends Component<Props> {
  static propTypes = {
    navigator: PropTypes.object,
    room: PropTypes.object,
    contacts: PropTypes.array,
    user: PropTypes.object,
  };

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
