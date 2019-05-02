import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createIsServiceAvailableSelector } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

import {
  fetchPaymentInformation,
} from '../actions';

const getDirectDepositEligibity = createIsServiceAvailableSelector(backendServices.EVSS_CLAIMS);

class PaymentInformation extends React.Component {
  static propTypes = {
    fetchPaymentInformation: PropTypes.func.isRequired,
    paymentInformation: PropTypes.object
  };

  componentDidMount() {
    this.props.fetchPaymentInformation();
  }

  render() {
    return (
      <h1>{JSON.stringify(this.props)}</h1>
    );
  }
}

const mapStateToProps = state => {
  return {
    isEligible: getDirectDepositEligibity(state),
    paymentInformation: state.vaProfile.paymentInformation
  }
};

const mapDispatchToProps = {
  fetchPaymentInformation,
};

const PaymentInformationContainer = connect(mapStateToProps, mapDispatchToProps)(PaymentInformation);

export default PaymentInformationContainer;
export { PaymentInformation };
