import React from 'react';
import { kebabCase } from 'lodash';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { consolidateAddress, expandAddress, isEmptyAddress } from '../../../../platform/forms/address/helpers';

import Address from './Address';
import LoadingButton from './LoadingButton';
import FormActionButtons from './FormActionButtons';

export default class AddressEditModal extends React.Component {
  componentDidMount() {
    let defaultFieldValue = {
      countryName: 'United States',
    };
    if (this.props.addressData) {
      defaultFieldValue = consolidateAddress(this.props.addressData);
    }
    this.props.onChange(defaultFieldValue);
  }

  onInput = (field, value) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value
    };

    this.props.onChange(newFieldValue);
  }

  // Receives the field name as its first arg but that fails the linter
  onBlur = () => {}

  onSubmit = (event) => {
    event.preventDefault();
    // @todo Refactor this...
    this.props.onSubmit(expandAddress(this.props.field.value));
  }

  renderActionButtons() {
    return (
      <FormActionButtons onCancel={this.props.onCancel} onDelete={this.props.onDelete} title={this.props.title} deleteEnabled={!isEmptyAddress(this.props.addressData)}>
        <LoadingButton isLoading={this.props.isLoading}>Update</LoadingButton>
        <button type="button" className="usa-button-secondary" onClick={this.props.onCancel}>Cancel</button>
      </FormActionButtons>
    );
  }

  render() {
    return (
      <Modal id={kebabCase(this.props.title)} onClose={this.props.onCancel} visible>
        <h3>Edit {this.props.title}</h3>
        <AlertBox
          isVisible={!!this.props.error}
          status="error"
          content={<p>We’re sorry. We couldn’t update your address. Please try again.</p>}
          onCloseAlert={this.props.clearErrors}/>
        <form onSubmit={this.onSubmit}>
          {this.props.field && (
            <Address
              address={this.props.field.value}
              onInput={this.onInput}
              onBlur={this.onBlur}
              errorMessages={{}}
              states={this.props.addressConstants.states}
              countries={this.props.addressConstants.countries}/>
          )}
          {this.renderActionButtons()}
        </form>
      </Modal>
    );
  }
}
