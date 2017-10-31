import React from 'react';
import { connect } from 'react-redux';

import { scrollToFirstError } from '../../common/utils/helpers';
import LoadingIndicator from '../../common/components/LoadingIndicator';

import {
  getStateName,
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
  addressUpdateUnavailable,
  inferAddressType,
  resetDisallowedAddressFields
} from '../utils/helpers';
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

// The address is empty if every field except type is falsey.
// NOTE: It "shouldn't" ever happen, but it did in testing, so...paranoid programming!
function isAddressEmpty(address) {
  return Object.keys(address).reduce((emptySoFar, nextField) => emptySoFar && (nextField === 'type' || !address[nextField]), true);
}

export class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingAddress: false,
      hasLoadedAddress: false,
      errorMessages: {},
      fieldsToValidate: {},
      editableAddress: props.savedAddress || {},
    };

    // On the off chance that savedAddress is available in constructor, ensure
    // we tell React that editableAddress has already been initialized with the
    // savedAddress values
    if (Object.keys(this.state.editableAddress).length > 0) {
      this.state.hasLoadedAddress = true;
      // If we start with an empty address, go straight to editing
      this.state.isEditingAddress = isAddressEmpty(this.state.editableAddress);
    }
  }


  /* editableAddress is initialized from redux store in the constructor
   * but the prop it initializes from is not available at time of mounting, which means users
   * will get a blank form instead of one prefilled with their existing data. This hook
   * ensures we populate the form's initial state as soon as the prop becomes available
   */
  componentWillReceiveProps(nextProps) {
    if (!this.state.hasLoadedAddress && Object.keys(nextProps.savedAddress).length > 0) {
      this.setState({
        hasLoadedAddress: true,
        editableAddress: nextProps.savedAddress,
        // If we recieve an empty address, start editing
        isEditingAddress: isAddressEmpty(nextProps.savedAddress)
      });
    }
  }

  /**
   * Runs all the validations against the address passed as a prop for a given field.
   *
   * @param {String} fieldName    The name of the address field to validate.
   *                               Maps to the fieldValidations key.
   * @param {Object} fullAddress  Contains the full mailing address.
   * @return {String|undefined}   If there's a validation error, return the
   *                               error message. If not, return undefined.
   */
  validateField = (fieldName, fullAddress) => {
    const validations = AddressSection.fieldValidations[fieldName];
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
   * @param {Object} address             The complete address as it appears while
   *                                      editing it.
   * @param {Boolean} shouldValidateAll  Because we'll need to update the error
   *                                      messages on multiple fields sometimes,
   *                                      we need to run validations on all fields.
   *                                      This ensures that we only run validation
   *                                      if the field has been modified.
   *                                      saveAddress will need to validate all
   *                                      fields regardless of whether they've been
   *                                      modified.
   * @return {Object}  Holds all the error messages for all the fields that have them.
   */
  validateAll = (address, fieldsToValidate, shouldValidateAll = false) => {
    const errorMessages = {};
    Object.keys(AddressSection.fieldValidations).forEach((fieldName) => {
      // Only validate the field if it's been modified
      if (fieldsToValidate[fieldName] || shouldValidateAll) {
        errorMessages[fieldName] = this.validateField(fieldName, address);
      }

    });

    return errorMessages;
  }

  // TODO: Make sure this doesn't allow us to save the address if there are validation errors
  saveAddress = () => {
    const errorMessages = this.validateAll(this.state.editableAddress, this.state.fieldsToValidate, true);
    // If there are errors, show them, but don't stop editing and don't save
    // There may be properties that are initialized to undefined, so we're checking
    //  to see if any of the properties are truthy
    if (Object.keys(errorMessages).some(key => errorMessages[key])) {
      // If we had any errors, make sure to validate them from here on out so we don't loose them
      const fieldsToValidate = Object.assign({}, this.state.fieldsToValidate);

      // Ideally, we'd only loop once, but errorMessages is so small and this is nicer to read
      Object.keys(errorMessages).forEach(key => fieldsToValidate[key] = true); // eslint-disable-line no-return-assign

      scrollToFirstError();

      this.setState({ errorMessages, fieldsToValidate });
      return;
    }

    this.setState({
      isEditingAddress: false,
      // Reset all the error messages in case they go to edit again; should be pointless
      errorMessages: {}
    });
    this.props.saveAddress(this.state.editableAddress);
  }

  handleCancel = () => {
    window.dataLayer.push({ event: 'letter-update-address-cancel' });
    this.setState({
      isEditingAddress: false,
      errorMessages: {},
      fieldsToValidate: {},
      editableAddress: this.props.savedAddress
    });
  }

  startEditing = () => {
    window.dataLayer.push({ event: 'letter-update-address-started' });
    this.setState({ isEditingAddress: true });
  }

  dirtyInput = (fieldName) => {
    let fieldsToValidate = this.state.fieldsToValidate;
    // When a field is blurred, add it to the fields we want to validate
    if (!fieldsToValidate[fieldName]) {
      fieldsToValidate = Object.assign({}, this.state.fieldsToValidate, { [fieldName]: true });

      // Make sure to _actually_ validate it
      const errorMessages = this.validateAll(this.state.editableAddress, fieldsToValidate);
      this.setState({
        fieldsToValidate,
        errorMessages
      });
    }
  }

  /**
   * Handles changing input from the Address component.
   * @param {String}  fieldName   The name of the field that's changing
   * @param {String}  update      The new value of the field
   * @param {Boolean} forceDirty  Whether to set the field as dirty immediately before validation.
   *                              Useful for select fields which don't trigger the onBlur event.
   */
  handleChange = (fieldName, update, forceDirty = false) => {
    let address = Object.assign({}, this.state.editableAddress, { [fieldName]: update });
    let fieldsToValidate = this.state.fieldsToValidate;
    // if country is changing we should clear the state
    if (fieldName === 'countryName') {
      address.stateCode = '';
    }

    const oldAddressType = address.type;
    // Make sure we've got the right address type (domestic, military, international)
    address = inferAddressType(address);

    // If our address type changes, make sure to clear out disallowed fields as necessary
    if (oldAddressType !== address.type) {
      address = resetDisallowedAddressFields(address);
    }

    // Force the input to dirty if necessary
    if (forceDirty && !fieldsToValidate[fieldName]) {
      fieldsToValidate = Object.assign({}, this.state.fieldsToValidate, { [fieldName]: true });
    }

    // Update the error messages
    // TODO: This might get super slow, so we can debounce the validation if necessary...probably
    const errorMessages = this.validateAll(address, fieldsToValidate);
    this.setState({
      fieldsToValidate,
      editableAddress: address,
      errorMessages,
    });
  }


  render() {
    const address = this.props.savedAddress || {};
    // Street address: first line of address
    const streetAddressLines = [
      address.addressOne,
      address.addressTwo ? `, ${address.addressTwo}` : '',
      address.addressThree ? ` ${address.addressThree}` : ''
    ];
    const streetAddress = streetAddressLines.join('').toLowerCase();

    // City, state, postal code: second line of address
    const zipCode = getZipCode(address);
    const city = address.city || '';
    let cityStatePostal;
    if (isDomesticAddress(address)) {
      const state = getStateName(address.stateCode);
      cityStatePostal = `${city}, ${state} ${zipCode}`;
    } else if (isMilitaryAddress(address)) {
      const militaryStateCode = address.stateCode || '';
      cityStatePostal = `${city}, ${militaryStateCode} ${zipCode}`;
    } else {
      // Must be an international address, only show a city
      cityStatePostal = `${city}`;
    }

    const country = isInternationalAddress(address) ? address.countryName : '';
    const addressContentLines = { streetAddress, cityStatePostal, country };

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            onInput={this.handleChange}
            onBlur={this.dirtyInput}
            address={this.state.editableAddress}
            errorMessages={this.state.errorMessages}
            countries={this.props.countries}
            states={this.props.states}
            required/>
          <button className="usa-button-primary" onClick={this.saveAddress}>Update</button>
          <button className="usa-button-outline" onClick={this.handleCancel}>Cancel</button>
        </div>
      );
    } else if (this.props.savePending) {
      addressFields = (
        <div>
          <LoadingIndicator message="Updating your address..."/>
        </div>
      );
    } else {
      addressFields = (
        <div>
          <div className="letters-address street">{streetAddress}</div>
          <div className="letters-address city-state">{cityStatePostal}</div>
          <div className="letters-address country">{country}</div>
          {this.props.canUpdate &&
            <button className="usa-button-outline" onClick={this.startEditing}>Edit</button>
          }
        </div>
      );
    }

    let addressContent;
    // If countries and states are not available when they try to update their address,
    // they will see this warning message instead of the address fields.
    if (this.state.isEditingAddress && (!this.props.countriesAvailable || !this.props.statesAvailable)) {
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

    return <div>{addressContent}</div>;
  }
}

// For testing purposes; we need to wrap the validators in spies--the same instances that are called in here
AddressSection.fieldValidations = {
  addressOne: addressOneValidations,
  zipCode: postalCodeValidations,
  stateCode: stateValidations,
  countryName: countryValidations,
  city: cityValidations
};

function mapStateToProps(state) {
  const {
    fullName,
    address,
    addressAvailability,
    canUpdate,
    countries,
    countriesAvailable,
    states,
    statesAvailable,
    saveAddressError,
    savePending
  } = state.letters;

  return {
    recipientName: fullName,
    canUpdate,
    savedAddress: address,
    addressAvailability,
    saveAddressError,
    savePending,
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
