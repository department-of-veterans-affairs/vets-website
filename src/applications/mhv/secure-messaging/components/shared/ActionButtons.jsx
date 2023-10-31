import React from 'react';
import PropTypes from 'prop-types';

function ActionButtons(props) {
  const { buttonsArray } = props;

  return (
    <div className="message-action-buttons vads-l-grid-container vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col"> {buttonsArray.map(button => button)}</div>
      </div>
    </div>
  );
}

ActionButtons.propTypes = {
  buttonsArray: PropTypes.array,
};

export default ActionButtons;
