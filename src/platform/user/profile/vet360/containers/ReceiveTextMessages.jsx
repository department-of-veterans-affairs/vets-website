import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
// import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import environment from 'platform/utilities/environment';
import { selectProfile } from 'platform/user/selectors';

import * as VET360 from '../constants';
import { createTransaction } from '../actions';
import { selectVet360Field, selectVet360Transaction } from '../selectors';

import {
  isPendingTransaction,
  isFailedTransaction,
} from '../util/transactions';

import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

class ReceiveTextMessages extends React.Component {
  componentDidMount() {
    if (this.props.profile.verified) {
      this.props.getEnrollmentStatus();
    }
  }

  onChange = event => {
    const payload = this.props.mobilePhone;
    payload.isTextPermitted = event;
    const method = payload.id ? 'PUT' : 'POST';
    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  render() {
    const {
      isTextable,
      isEnrolledInHealthCare,
      isEmpty,
      transaction,
    } = this.props;

    const hasError = transaction && isFailedTransaction(transaction);

    if (
      environment.isProduction() ||
      isEmpty ||
      !isTextable ||
      !isEnrolledInHealthCare ||
      hasError ||
      (transaction && isPendingTransaction(this.props.transaction))
    )
      return null;

    return (
      <div className="receive-text-messages">
        <div className="form-checkbox-buttons">
          <ErrorableCheckbox
            checked={!!this.props.checked}
            label={
              <span>
                Receive text messages (SMS) for VA health care appointment
                reminders.
              </span>
            }
            onValueChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const profileState = selectProfile(state);
  const { fieldName, title } = ownProps;
  const { transaction } = selectVet360Transaction(state, fieldName);
  const mobilePhone = selectVet360Field(state, fieldName);
  const isEmpty = !mobilePhone;
  const isTextable = mobilePhone && mobilePhone.isTextable;
  const isTextPermitted = mobilePhone && mobilePhone.isTextPermitted;
  const checked = isTextable && isTextPermitted;
  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    profile: profileState,
    mobilePhone,
    title,
    isEmpty,
    isTextable,
    isTextPermitted,
    checked,
    isEnrolledInHealthCare: isEnrolledInVAHealthCare(state),
    transaction,
  };
}

const mapDispatchToProps = {
  getEnrollmentStatus: getEnrollmentStatusAction,
  createTransaction,
};

const ReceiveTextMessagesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiveTextMessages);

export default ReceiveTextMessagesContainer;
