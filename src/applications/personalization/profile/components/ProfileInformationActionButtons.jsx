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
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default ProfileInformationActionButtons;
