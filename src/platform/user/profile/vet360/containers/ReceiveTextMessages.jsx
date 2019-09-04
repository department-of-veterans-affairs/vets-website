/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';

import * as VET360 from '../constants';

import environment from 'platform/utilities/environment';
import { selectProfile } from 'platform/user/selectors';
import { isPendingTransaction } from '../util/transactions';

import { createTransaction } from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectEditedFormField,
} from '../selectors';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

class ReceiveTextMessages extends React.Component {
  state = {
    showSuccess: false,
    checkboxValue: this.props.checked,
  };

  componentDidMount() {
    if (this.props.profile.verified) {
      this.props.getEnrollmentStatus();
    }
  }

  onChange = event => {
    // true or false
    let payload = event;

    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }

    const method = payload.id ? 'PUT' : 'POST';

    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );

    this.setState({
      checkboxValue: event,
      showSuccess: true, // TODO: not what we want
    });
  };

  isSuccessAlertVisible = () => {
    // TODO: This is not enough
    return this.state.showSuccess;
  };

  render() {
    const {
      isTextable,
      isEnrolledInHealthCare,
      isEmpty,
      transaction,
    } = this.props;

    if (
      environment.isProduction() ||
      isEmpty ||
      !isTextable ||
      !isEnrolledInHealthCare ||
      (transaction && isPendingTransaction(this.props.transaction))
    )
      return null;

    return (
      <div className="receive-text-messages">
        <div className="form-checkbox-buttons">
          <ErrorableCheckbox
            checked={!!this.state.checkboxValue}
            label={
              <span>
                Receive text messages (SMS) for VA health care appointment
                reminders.
              </span>
            }
            onValueChange={this.onChange}
          />
          <AlertBox
            isVisible={this.isSuccessAlertVisible()}
            content={<p>Your preference has been saved.</p>}
            status="success"
            backgroundOnly
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
    field: selectEditedFormField(state, fieldName),
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
