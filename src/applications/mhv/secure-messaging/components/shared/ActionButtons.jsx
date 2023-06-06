import React from 'react';
import PropTypes from 'prop-types';

function ActionButtons(props) {
  const { buttonsArray } = props;

  return (
    <ul className="message-action-buttons vads-u-margin-y--4">
      {buttonsArray.map(button => button)}
    </ul>
  );
}

ActionButtons.propTypes = {
  buttonsArray: PropTypes.array,
};

export default ActionButtons;
