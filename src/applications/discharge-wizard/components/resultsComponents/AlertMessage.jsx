import React from 'react';
import PropTypes from 'prop-types';

const AlertMessage = ({ content, isVisible, status }) => {
  return (
    <va-alert visible={isVisible} status={status}>
      {content || null}
    </va-alert>
  );
};

AlertMessage.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
  isVisible: PropTypes.bool,
  status: PropTypes.string,
};

export default AlertMessage;
