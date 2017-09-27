import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getStateName,
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
  addressUpdateUnavailable,
  invalidAddressProperty,
} from '../utils/helpers.jsx';
import { saveAddress } from '../actions/letters';
import Address from '../components/Address';
import AddressContent from '../components/AddressContent';

import {
  addressOneValidations,
  postalCodeValidations,
  stateValidations,
  countryValidations,
  cityValidations
} from '../utils/validations';
import { ADDRESS_TYPES } from '../utils/constants';

const fieldValidations = {
  addressOne: addressOneValidations,
  zipCode: postalCodeValidations,
  stateCode: stateValidations,
  countryName: countryValidations,
  city: cityValidations
};

export class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingAddress: false,
      hasLoadedAddress: false,
      errorMessages: {},
      shouldValidate: {},
      editableAddress: props.savedAddress || {},
    };

    // On the off chance that savedAddress is available in constructor, ensure
    // we tell React that editableAddress has already been initialized with the
    // savedAddress values
    if (Object.keys(this.state.editableAddress).length > 0) {
      this.state.hasLoadedAddress = true;
    }
  }


  /* editableAddress is initialized from redux store in the constructor
   * but the prop it initializes from is not available at time of mounting, which means users
   * will get a blank form instead of one prefilled with their existing data. This hook
   * ensures we populate the form's initial state as soon as the prop becomes available
   */
  componentWillReceiveProps(nextProps) {
    if (!this.state.hasLoadedAddress && Object.keys(nextProps.savedAddress).length > 0) {
      this.setState({ hasLoadedAddress: true, editableAddress: nextProps.savedAddress });
    }
  }

  /**
   * Runs all the validations against the address passed as a prop for a given field.
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
      errorMessages: {}
    });
    this.props.saveAddress(this.state.editableAddress);
  }

  /**
   * Infers the address type from the address supplied and returns the address
   *  with the "new" type.
   */
  inferAddressType = (address) => {
    let type = ADDRESS_TYPES.domestic;
    if (!['USA', 'US'].includes(address.countryName)) {
      type = ADDRESS_TYPES.international;
    } else if (['AE', 'AA', 'AP'].includes(address.stateCode)) {
      // Are these ^^ constants anywhere?
      type = ADDRESS_TYPES.military;
    }

    return Object.assign({}, address, { type });
  }

  handleCancel = () => {
    this.setState({
      isEditingAddress: false,
      editableAddress: this.props.savedAddress
    });
  }


  handleChange = (fieldName, update) => {
    // When a field is changed, make sure we validate it
    if (!this.state.shouldValidate[fieldName]) {
      this.setState({ shouldValidate: Object.assign({}, this.state.shouldValidate, { [fieldName]: true }) });
    }

    let address = Object.assign({}, this.state.editableAddress, { [fieldName]: update });
    // if country is changing we should clear the state
    if (fieldName === 'countryName') {
      address.stateCode = '';
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
      const city = address.city || '';
      const militaryStateCode = address.stateCode || '';
      cityStatePostal = `${city}, ${militaryStateCode} ${zipCode}`;
    }
    const country = isInternationalAddress(address) ? address.countryName : '';
    const addressContentLines = { streetAddress, cityStatePostal, country };

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            onInput={this.handleChange}
            address={this.state.editableAddress}
            errorMessages={this.state.errorMessages}
            countries={this.props.countries}
            states={this.props.states}
            required/>
          <button className="usa-button-primary" onClick={this.saveAddress}>Update</button>
          <button className="usa-button-outline" onClick={this.handleCancel}>Cancel</button>
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
    // If countries and states are not available when they try to update their address,
    // they will see this warning message instead of the address fields.
    if (isEmpty(address)) {
      addressContent = invalidAddressProperty;
    } else if (this.state.isEditingAddress && (!this.props.countriesAvailable || !this.props.statesAvailable)) {
      addressContent = (
        <div className="step-content">
          {addressUpdateUnavailable}
        </div>
      );
    } else {
      addressContent = (
        <AddressContent
          saveError={this.props.saveAddressError}
          name={(this.props.recipientName || '').toLowerCase()}
          addressObject={addressContentLines}>
          {addressFields}
        </AddressContent>
      );
    }

    return addressContent;
  }
}

function mapStateToProps(state) {
  const { fullName, address, canUpdate, countries, countriesAvailable, states, statesAvailable, saveAddressError } = state.letters;
  return {
    recipientName: fullName,
    canUpdate,
    savedAddress: address,
    saveAddressError,
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
