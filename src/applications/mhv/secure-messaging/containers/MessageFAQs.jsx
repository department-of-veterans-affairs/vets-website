/** 
MessageFAQs Container
@author Vic Saleem 
*/

import React from 'react';
import PropTypes from 'prop-types';
import MessageFAQ from '../components/MessageFAQ';

const MessageFAQs = props => {
  const { isLoggedIn } = props;
  return (
    <div className="vads-l-grid-container vads-u-margin-top--2 message-faq-container">
      <MessageFAQ isLoggedIn={isLoggedIn} />
    </div>
  );
};

MessageFAQs.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default MessageFAQs;
