import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessagePromptDiv = ({ id, message, waitBeforeShow = 0 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(
    () => {
      setTimeout(() => {
        setIsShown(true);
      }, waitBeforeShow);
    },
    [waitBeforeShow],
  );

  return isShown ? (
    <div className="dropdown" role="alert" id={id}>
      <div className="vads-u-margin--1p5">{message}</div>
    </div>
  ) : null;
};

MessagePromptDiv.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
  waitBeforeShow: PropTypes.number,
};

export default MessagePromptDiv;
