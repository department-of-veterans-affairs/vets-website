import React from 'react';
import PropTypes from 'prop-types';

function ContactInformationActionButtons(props) {
  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column">
      {props.children}
    </div>
  );
}

ContactInformationActionButtons.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default ContactInformationActionButtons;
