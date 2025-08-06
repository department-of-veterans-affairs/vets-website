import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export const CheckboxAlert = ({ error, success }) => {
  if (error) {
    return (
      <VaAlert data-role="alert" slim status="error" visible>
        <p className="vads-u-margin-y--0">
          We’re sorry. We can’t update your information right now. We’re working
          to fix this problem. Try again later.
        </p>
      </VaAlert>
    );
  }

  if (success) {
    return (
      <VaAlert data-role="alert" slim status="success" visible>
        <p className="vads-u-margin-y--0">Update saved</p>
      </VaAlert>
    );
  }

  return null;
};

CheckboxAlert.propTypes = {
  error: PropTypes.bool,
  loading: PropTypes.bool,
  success: PropTypes.bool,
};
