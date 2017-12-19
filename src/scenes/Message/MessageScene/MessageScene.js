import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MessageContainer } from 'AppContainers';

class MessageScene extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    user: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { navigator, user } = this.props;

    return (
      <MessageContainer
        navigator={navigator}
        user={user}
      />
    );
  }
}

export default MessageScene;
