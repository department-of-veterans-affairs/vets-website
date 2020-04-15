import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { ACCOUNT_TYPES_OPTIONS } from '../constants';

import PaymentInformationEditModalError from './PaymentInformationEditModalError';

const schema = {
  type: 'object',
  properties: {
    routingNumber: {
      type: 'string',
      pattern: '^\\d{9}$',
    },
    accountNumber: {
      type: 'string',
      pattern: '^\\d{1,17}$',
    },
    accountType: {
      type: 'string',
      enum: Object.values(ACCOUNT_TYPES_OPTIONS),
    },
  },
  required: ['accountNumber', 'routingNumber', 'accountType'],
};

const uiSchema = {
  routingNumber: {
    'ui:title':
      'Routing number (Your 9-digit routing number will update your bank’s name)',
    'ui:errorMessages': {
      pattern: 'Please enter the bank’s 9-digit routing number.',
      required: 'Please enter the bank’s 9-digit routing number.',
    },
  },
  accountNumber: {
    'ui:title': 'Account number (No more than 17 digits)',
    'ui:errorMessages': {
      pattern: 'Please enter your account number.',
      required: 'Please enter your account number.',
    },
  },
  accountType: {
    'ui:title': 'Account type',
    'ui:errorMessages': {
      required: 'Please select the type that best describes the account.',
    },
  },
};

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    responseError: PropTypes.object,
  };

  state = {
    formData: {},
  };

  componentDidUpdate = prevProps => {
    if (this.props.isEditing && !prevProps.isEditing) {
      this.setState({ formData: {} });
    }
  };

  formSubmit = ({ formData }) => {
    this.props.onSubmit({
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: formData.routingNumber,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
    });
  };

  render() {
    return (
      <Modal
        title="Edit your direct deposit information"
        visible={this.props.isEditing}
        onClose={this.props.onClose}
      >
        <div id="errors" role="alert" aria-atomic="true">
          {!!this.props.responseError && (
            <PaymentInformationEditModalError
              responseError={this.props.responseError}
              closeModal={this.props.onClose}
            />
          )}
        </div>
        <p className="vads-u-margin-top--1p5">
          Please provide your bank’s current routing number as well as your
          current account number and type. Then click <strong>Update</strong> to
          save your information.
        </p>
        <img
          src="/img/direct-deposit-check-guide.png"
          alt="On a personal check, find your bank's 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />

        <SchemaForm
          name="Direct Deposit Information"
          title="Direct Deposit Information"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.formSubmit}
          onChange={formData => this.setState({ formData })}
          data={this.state.formData}
        >
          <LoadingButton
            type="submit"
            className="usa-button-primary vads-u-margin-top--0 vads-u-width--full small-screen:vads-u-width--auto"
            isLoading={this.props.isSaving}
          >
            Update
          </LoadingButton>

          <button
            type="button"
            disabled={this.props.isSaving}
            className="usa-button-secondary"
            onClick={this.props.onClose}
          >
            Cancel
          </button>
        </SchemaForm>
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;
