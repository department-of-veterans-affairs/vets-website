import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { selectProfile } from 'platform/user/selectors';

import * as VET360 from '../constants';
import { createTransaction, clearTransactionStatus } from '../actions';
import { selectVet360Transaction } from 'platform/user/profile/vet360/selectors';
import { profileShowReceiveTextNotifications } from 'applications/personalization/profile360/selectors';

import {
  isPendingTransaction,
  isFailedTransaction,
} from '../util/transactions';

import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

class ReceiveTextMessages extends React.Component {
  state = {
    startedTransaction: false,
    completedTransaction: false,
    lastTransaction: null,
  };

  componentDidMount() {
    if (this.props.isVerified) {
      this.props.getEnrollmentStatus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction) {
      this.setState({ lastTransaction: nextProps.transaction });
      if (!this.props.transaction) {
        this.setState({ completedTransaction: true });
      }
    }
  }

  componentWillUnmount() {
    this.clearSuccess();
  }

  onChange = event => {
    if (this.state.startedTransaction) return;
    if (this.state.lastTransaction) this.clearSuccess();
    this.setState({
      startedTransaction: true,
      completedTransaction: false,
      lastTransaction: null,
    });
    const payload = this.props.profile.vet360.mobilePhone;
    payload.isTextPermitted = event;
    const method = payload.id ? 'PUT' : 'POST';
    const smsAction = payload.isTextPermitted ? 'smsOptin' : 'smsOptout';
    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      VET360.ANALYTICS_FIELD_MAP[smsAction],
    );
  };

  clearSuccess = () => {
    this.props.clearTransactionStatus();
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.setState({
      startedTransaction: false,
      completedTransaction: false,
      lastTransaction: null,
    });
  };

  isSuccessVisible() {
    let showSuccess = false;
    if (this.state.startedTransaction && this.state.completedTransaction) {
      showSuccess = this.props.transactionSuccess;
      if (this.intervalId === undefined)
        this.intervalId = setInterval(this.clearSuccess, 3000);
    }
    return showSuccess;
  }

  render() {
    const { hideCheckbox } = this.props;

    if (hideCheckbox) return null;

    return (
      <div className="receive-text-messages">
        <div className="form-checkbox-buttons">
          <ErrorableCheckbox
            checked={!!this.props.profile.vet360.mobilePhone.isTextPermitted}
            label={
              <span>
                Please check the box if you want to receive text message (SMS)
                reminders for your VA health care appointments.
              </span>
            }
            onValueChange={this.onChange}
          />
          <AlertBox
            isVisible={this.isSuccessVisible()}
            content={<p>We've saved your preference.</p>}
            status="success"
            backgroundOnly
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { fieldName } = ownProps;
  const { transaction } = selectVet360Transaction(state, fieldName);
  const hasError = !!isFailedTransaction(transaction);
  const isPending = !!isPendingTransaction(transaction);
  const showReceiveTextNotifications = profileShowReceiveTextNotifications(
    state,
  );
  const profileState = selectProfile(state);
  const isEmpty = !profileState.vet360.mobilePhone;
  const isTextable =
    !isEmpty &&
    profileState.vet360.mobilePhone.phoneType === VET360.PHONE_TYPE.mobilePhone;
  const isVerified = showReceiveTextNotifications && profileState.verified;
  const hideCheckbox =
    !showReceiveTextNotifications ||
    isEmpty ||
    !isTextable ||
    !isEnrolledInVAHealthCare(state) ||
    hasError ||
    isPending;
  const transactionSuccess =
    state.vet360.transactionStatus ===
    VET360.TRANSACTION_STATUS.COMPLETED_SUCCESS;
  return {
    profile: profileState,
    hideCheckbox,
    isVerified,
    transaction,
    transactionSuccess,
    apiRoute: VET360.API_ROUTES.TELEPHONES,
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
