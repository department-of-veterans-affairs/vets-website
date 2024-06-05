// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {(string|JSX)} content
 * @param {boolean} isVisible
 * @param {string} status
 * @returns {JSX}
 *
 * This function is a friendly wrapper for the va-alert web component
 * See => https://design.va.gov/storybook/?path=/docs/components-va-alert--default for usage and more props to add.
 */
const AlertMessage = ({ content, isVisible, status }) => {
  return (
    <va-alert visible={isVisible} status={status} uswds>
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
