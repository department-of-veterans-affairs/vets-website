import React from 'react';
import PropTypes from 'prop-types';

const DirectDepositDescription = ({ formContext = {} }) => {
  if (formContext.onReviewPage) {
    return null;
  }

  return (
    <p>
      <strong>Note:</strong> We make payments only through direct deposit, also
      called electronic funds transfer (EFT).
    </p>
  );
};
DirectDepositDescription.propTypes = {
  formContext: PropTypes.shape({
    touched: PropTypes.object,
    submitted: PropTypes.bool,
    hideTitle: PropTypes.bool,
    pageTitle: PropTypes.string,
    reviewMode: PropTypes.bool,
    trackingPrefix: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    prefilled: PropTypes.bool,
    onReviewPage: PropTypes.bool,
  }),
};

export default DirectDepositDescription;
