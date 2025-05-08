import React from 'react';
import PropTypes from 'prop-types';

const DirectDepositDescription = ({ formContext, title }) => {
  if (!formContext || formContext.onReviewPage) {
    return null;
  }

  return (
    <div className="vads-u-font-size--h5 vads-u-margin-top--0">{title}</div>
  );
};

DirectDepositDescription.propTypes = {
  title: PropTypes.string.isRequired,
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
