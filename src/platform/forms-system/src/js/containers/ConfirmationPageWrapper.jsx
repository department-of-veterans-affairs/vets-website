import React from 'react';
import PropTypes from 'prop-types';

/**
 * Added this confirmation page wrapper to allow global customization of the
 * print view.
 */
const ConfirmationPageWrapper = props => {
  const { formConfig } = props.route || {};
  const Confirmation = formConfig.confirmation || null;
  return <Confirmation {...props} />;
};

ConfirmationPageWrapper.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      confirmation: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
      ]),
    }),
  }),
};

export default ConfirmationPageWrapper;
