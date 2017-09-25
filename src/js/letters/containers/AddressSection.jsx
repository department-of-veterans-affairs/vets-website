import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getStateName,
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
  addressUpdateUnavailable
} from '../utils/helpers.jsx';
import { saveAddress } from '../actions/letters';
import Address from '../components/Address';
import InvalidAddress from '../components/InvalidAddress';
import AddressContent from '../components/AddressContent';

export class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoadedAddress: false,
      isEditingAddress: false,
      editableAddress: this.props.savedAddress || {},
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

  handleSave = () => {
    this.setState({ isEditingAddress: false });

    this.props.saveAddress(this.state.editableAddress);
  }

  handleChange = (path, update) => {
    this.setState(({ editableAddress }) => {
      // reset state code when user updates country
      const newFragment = (path === 'country'
        ? {
          [path]: update,
          state: '',
          militaryStateCode: '',
        }
        : { [path]: update }
      );

      return {
        editableAddress: Object.assign({}, editableAddress, newFragment),
      };
    });
  }

  render() {
    // We want to use the Redux address as source of truth. Address in
    // this container's state is only used to control the form input for the
    // <Address/> component. If form update fails, we still want to show
    // users their original address instead of always over-riding what's
    // saved in Redux with what the user types into the form.
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
    const addressContentLines = { streetAddress, cityStatePostal, country };

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            onInput={this.handleChange}
            address={this.state.editableAddress}
            countries={this.props.countries}
            states={this.props.states}
            required/>
          <button className="usa-button-primary" onClick={this.handleSave}>Update</button>
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
    // If countries and states are not available when they try to update their address,
    // they will see this warning message instead of the address fields.
    if (isEmpty(address)) {
      addressContent = <InvalidAddress/>;
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
  saveAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection);
