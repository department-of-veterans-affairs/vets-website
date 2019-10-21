import React from 'react';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';
import { selectProfile } from 'platform/user/selectors';

import * as VET360 from '../constants';
import { createTransaction, clearTransactionStatus } from '../actions';
import { selectVet360Transaction } from '../selectors';

import {
  isPendingTransaction,
  isFailedTransaction,
} from '../util/transactions';

import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

class ReceiveTextMessages extends React.Component {
  componentDidMount() {
    if (this.props.isVerified) {
      this.props.getEnrollmentStatus();
    }
  }

  render() {
    const { hideMessage } = this.props;

    if (hideMessage) return null;

    if (this.props.profile.vet360.mobilePhone.isTextPermitted) {
      return (
        <p className="receive-text-messages">
          <span className="fas fa-check vads-u-color--green" /> We'll send VA
          health care appointment text message reminders to this number.
        </p>
      );
    }

    return (
      <p className="receive-text-messages">
        You have not opted in to VA health care appointment text message
        reminders. Click Edit to opt in.
      </p>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { fieldName } = ownProps;
  const { transaction } = selectVet360Transaction(state, fieldName);
  const hasError = !!(transaction && isFailedTransaction(transaction));
  const isPending = !!(transaction && isPendingTransaction(transaction));
  const profileState = selectProfile(state);
  const isEmpty = !profileState.vet360.mobilePhone;
  const isTextable =
    !isEmpty &&
    profileState.vet360.mobilePhone.phoneType === VET360.PHONE_TYPE.mobilePhone;
  const isVerified = !environment.isProduction() && profileState.verified;
  const hideMessage =
    environment.isProduction() ||
    isEmpty ||
    !isTextable ||
    !isEnrolledInVAHealthCare(state) ||
    hasError ||
    isPending;
  return {
    profile: profileState,
    hideMessage,
    isVerified,
  };
}

const mapDispatchToProps = {
  getEnrollmentStatus: getEnrollmentStatusAction,
  createTransaction,
  clearTransactionStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiveTextMessages);

export { ReceiveTextMessages };
