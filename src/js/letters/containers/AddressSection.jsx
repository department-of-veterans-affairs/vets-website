import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getStateName,
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
  invalidAddressProperty,
  addressUpdateUnavailable
} from '../utils/helpers.jsx';
import { saveAddress } from '../actions/letters';
import Address from '../components/Address';

import {
  addressOneValidations,
  postalCodeValidations,
  stateValidations,
  countryValidations,
  cityValidations
} from '../utils/validations';
import { addressTypes } from '../utils/constants';

const fieldValidations = {
  addressOne: addressOneValidations,
  zipCode: postalCodeValidations,
  state: stateValidations,
  country: countryValidations,
  city: cityValidations
};

export class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingAddress: false,
      errorMessages: {},
      shouldValidate: {},
      editableAddress: props.address
    };
  }

  /**
   * Runs all the valiations against the address passed as a prop for a given field.
   *
   * @param {String} fieldName             The name of the address field to validate.
   *                                         Maps to the fieldValidations key.
   * @param {Object} fullAddress            Contains the full mailing address.
   * @param {Boolean} ignoreShouldValidate  Because we'll need to update the error
   *                                         messages on multiple fields sometimes,
   *                                         we need to run validations on all fields.
   *                                         This ensures that we only run validation
   *                                         if the field has been modified.
   *                                         saveAddress will need to validate all
   *                                         fields regardless of whether they've been
   *                                         modified.
   * @return {String|undefined}             If there's a validation error, return the
   *                                         error message. If not, return undefined.
   */
  validateField = (fieldName, fullAddress, ignoreShouldValidate = false) => {
    // Only validate the field if it's been modified
    if (!this.state.shouldValidate[fieldName] || ignoreShouldValidate) {
      return undefined;
    }

    const validations = fieldValidations[fieldName];
    // If there is no validations array for that field, assume it has no validations
    if (!validations) {
      return undefined;
    }

    let errorMessage = false;
    for (let i = 0; i < validations.length; i++) {
      // this.props.value = address
      errorMessage = validations[i](fullAddress[fieldName], fullAddress);
      if (typeof errorMessage === 'string') {
        return errorMessage;
      }
    }

    // All validations passed; there are no error messages to report
    return undefined;
  }

  /**
   * Runs validation for all fields, returning a complete errorMessages object.
   *
   * @return {Object}  Holds all the error messages for all the fields that have them.
   */
  validateAll = (address = this.state.editableAddress) => {
    const errorMessages = {};
    Object.keys(fieldValidations).forEach((fieldName) => {
      errorMessages[fieldName] = this.validateField(fieldName, address);
    });

    return errorMessages;
  }

  // TODO: Make sure this doesn't allow us to save the address if there are validation errors
  saveAddress = () => {
    const errorMessages = this.validateAll();
    // If there are errors, show them, but don't stop editing and don't save
    if (Object.keys(errorMessages).length === 0) {
      this.setState({ errorMessages });
      return;
    }

    this.setState({
      isEditingAddress: false,
      // Reset all the error messages in case they go to edit again; should be pointless
      errorMessages
    });
    this.props.saveAddress(this.props.address);
  }

  /**
   * Infers the address type from the address supplied and returns the address
   *  with the "new" type.
   */
  inferAddressType = (address) => {
    let type = addressTypes.domestic;
    if (!['USA', 'US'].includes(address.country)) {
      type = addressTypes.international;
    } else if (address.militaryStateCode) {
      // TODO: Make sure we clear this out if a state code is selected
      type = addressTypes.military;
    }

    return Object.assign({}, address, { type });
  }

  handleChange = (fieldName, update) => {
    // When a field is changed, make sure we validate it
    if (!this.state.shouldValidate[fieldName]) {
      this.setState({ shouldValidate: Object.assign({}, this.state.shouldValidate, { [fieldName]: true }) });
    }

    let address = Object.assign({}, this.state.editableAddress, { [fieldName]: update });
    // if country is changing we should clear the state
    if (fieldName === 'country') {
      address.state = '';
    }

    // Make sure we've got the right address type (domestic, military, international)
    address = this.inferAddressType(address);

    // Update the error messages
    // TODO: This might get super slow, so we can debounce this part if necessary...probably
    const errorMessages = this.validateAll(address);
    this.setState({
      editableAddress: address,
      errorMessages
    });
  }


  render() {
    const address = this.state.editableAddress || {};

    // Street address: first line of address
    const streetAddressLines = [
      address.addressOne,
      address.addressTwo ? `, ${address.addressTwo}` : '',
      address.addressThree ? ` ${address.addressThree}` : ''
    ];
    const streetAddress = streetAddressLines.join('').toLowerCase();

    // City, state, postal code: second line of address
    const zipCode = getZipCode(address);
    let cityStatePostal;
    if (isDomesticAddress(address)) {
      const city = (address.city || '').toLowerCase();
      const state = getStateName(address.stateCode);
      cityStatePostal = `${city}, ${state} ${zipCode}`;
    } else if (isMilitaryAddress(address)) {
      const militaryPostOfficeTypeCode = address.militaryPostOfficeTypeCode || '';
      const militaryStateCode = address.militaryStateCode || '';
      cityStatePostal = `${militaryPostOfficeTypeCode}, ${militaryStateCode} ${zipCode}`;
    }
    const country = isInternationalAddress(address) ? address.countryName : '';

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            value={address}
            onUserInput={this.handleChange}
            errorMessages={this.state.errorMessages}
            countries={this.props.countries}
            states={this.props.states}
            required/>
          <button className="usa-button-primary" onClick={this.saveAddress}>Update</button>
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: false })}>Cancel</button>
        </div>
      );
    } else {
      addressFields = (
        <div>
          <div className="letters-address">{streetAddress}</div>
          <div className="letters-address">{cityStatePostal}</div>
          <div className="letters-address">{country}</div>
          {this.props.canUpdate &&
            <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: true })}>Edit</button>
          }
        </div>
      );
    }

    let addressContent;
    if (isEmpty(address)) {
      addressContent = (
        <div className="step-content">
          {invalidAddressProperty}
        </div>
      );
    // If countries and states are not available when they try to update their address,
    // they will see this warning message instead of the address fields.
    } else if (this.state.isEditingAddress && (!this.props.countriesAvailable || !this.props.statesAvailable)) {
      addressContent = (
        <div className="step-content">
          {addressUpdateUnavailable}
        </div>
      );
    } else {
      addressContent = (
        <div className="step-content">
          <p>
            Downloaded documents will list your address as:
          </p>
          <div className="address-block">
            <h5 className="letters-address">{(this.props.recipientName || '').toLowerCase()}</h5>
            {addressFields}
          </div>
          <p>A correct address is not required, but keeping it up to date can help you on Vets.gov.</p>
        </div>
      );
    }

    return (
      <div>
        {addressContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fullName, address, canUpdate, countries, countriesAvailable, states, statesAvailable } = state.letters;
  return {
    recipientName: fullName,
    address,
    canUpdate,
    countries,
    countriesAvailable,
    states,
    statesAvailable
  };
}

const mapDispatchToProps = {
  saveAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection);

