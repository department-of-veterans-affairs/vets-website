import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createIsServiceAvailableSelector } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

function PaymentInformationTOCItem({ isEligible }) {
  if (!isEligible) {
    return null;
  }
  return (
    <li>
      <a href="#direct-deposit">Direct deposit information</a>
    </li>
  );
}

PaymentInformationTOCItem.propTypes = {
  isEligible: PropTypes.bool.isRequired,
};

const isEvssAvailable = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);

const mapStateToProps = state => ({
  isEligible: isEvssAvailable(state),
});

const PaymentInformationTOCItemContainer = connect(mapStateToProps)(
  PaymentInformationTOCItem,
);

export default PaymentInformationTOCItemContainer;

export { PaymentInformationTOCItem };
