import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessagePromptDiv = ({ id, message, waitBeforeShow = 0 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(
    () => {
      const timeoutFn = setTimeout(() => {
        setIsShown(true);
      }, waitBeforeShow);

      return () => clearTimeout(timeoutFn);
    },
    [waitBeforeShow],
  );

  return isShown ? (
    <div className="dropdown" role="alert">
      <div className="vads-u-margin--1p5" id={id}>
        {message}
      </div>
    </div>
  ) : null;
};

MessagePromptDiv.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
  waitBeforeShow: PropTypes.number,
};

export default MessagePromptDiv;
