import React from 'react';
import PropTypes from 'prop-types';

const MessagePromptDiv = props => {
  return (
    <div className="dropdown" role="alert">
      <div className="vads-u-margin--1p5">{props.message}</div>
    </div>
  );
};

MessagePromptDiv.propTypes = {
  message: PropTypes.string,
};

export default MessagePromptDiv;
