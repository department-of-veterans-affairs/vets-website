import React from 'react';
import PropTypes from 'prop-types';

function ProfileInformationActionButtons(props) {
  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column">
      {props.children}
    </div>
  );
}

ProfileInformationActionButtons.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileInformationActionButtons;
