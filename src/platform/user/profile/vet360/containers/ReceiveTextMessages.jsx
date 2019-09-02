/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';
import { selectProfile } from 'platform/user/selectors';
import * as VET360 from '../constants';
import { isPendingTransaction } from '../util/transactions';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormField,
} from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectEditedFormField,
} from '../selectors';

import Vet360Transaction from '../components/base/Transaction';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

class ReceiveTextMessages extends React.Component {
  state = { showSuccess: false, checkboxValue: this.props.checked };

  componentDidMount() {
    if (this.props.profile.verified) {
      this.props.getEnrollmentStatus();
    }
  }

  onChange = event => {
    this.setState({ checkboxValue: event });
    // start the api call to update isTextPermitted with value of event (true/false)
    // make checkbox disabled until api call comes back
    // when api call comes back as a success then re-enable checkbox and make success message visable
    this.setState({ showSuccess: true });
    // TODO: Figure out where/when to make the success alert invisible again after that

    let payload = this.props.field.value;
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
  };

  isSuccessAlertVisible = () => {
    // TODO: Put logic here to control success alert box.
    let transactionPending = false;
    if (this.props.transaction) {
      transactionPending = isPendingTransaction(this.props.transaction);
    }
    // TODO: This is not right yet...
    return this.props.mobilePhone && !transactionPending;
    // this.state.showSuccess;
  };

  render() {
    if (
      environment.isProduction() ||
      !this.props.isTextable ||
      !this.props.isEnrolledInHealthCare
    )
      return null;

    const { title, transaction, transactionRequest } = this.props;
    // TODO: There might be more attributes needed on this checkbox to get
    // it wired up as the entire mobile phone field
    return (
      <div className="receive-text-messages">
        <div className="form-checkbox-buttons">
          <ErrorableCheckbox
            name="isTextPermitted"
            checked={this.state.checkboxValue}
            label={
              <span>
                Receive text messages (SMS) for VA health care appointment
                reminders.
              </span>
            }
            onValueChange={this.onChange}
          />
          <Vet360Transaction
            title={title}
            transaction={transaction}
            transactionRequest={transactionRequest}
            refreshTransaction={this.props.refreshTransaction.bind(
              this,
              transaction,
            )}
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

export function mapStateToProps(state) {
  const profileState = selectProfile(state);
  const fieldName = VET360.FIELD_NAMES.MOBILE_PHONE;
  const { transaction, transactionRequest } = selectVet360Transaction(
    state,
    fieldName,
  );

  const mobilePhone = selectVet360Field(state, fieldName);

  const isTextable = mobilePhone && mobilePhone.isTextable;

  const isTextPermitted = mobilePhone && mobilePhone.isTextPermitted;

  const checked = isTextable && isTextPermitted;

  const isEnrolledInHealthCare = isEnrolledInVAHealthCare(state);

  return {
    profile: profileState,
    mobilePhone,
    isTextable,
    isTextPermitted,
    checked,
    isEnrolledInHealthCare,
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    field: selectEditedFormField(state, fieldName),
    transaction,
    transactionRequest,
  };
}

const mapDispatchToProps = {
  enrollmentStatus: getEnrollmentStatusAction,
  clearTransactionRequest,
  refreshTransaction,
  createTransaction,
  updateFormField,
};

const ReceiveTextMessagesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiveTextMessages);

export default ReceiveTextMessagesContainer;
