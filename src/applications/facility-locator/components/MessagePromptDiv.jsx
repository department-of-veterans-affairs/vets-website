import React from 'react';
import PropTypes from 'prop-types';

const MessagePromptDiv = props => {
  return (
    <div className="dropdown" role="alert" id={props.id}>
      <div className="vads-u-margin--1p5">{props.message}</div>
    </div>
  );
};

MessagePromptDiv.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
};

export default MessagePromptDiv;
