import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
  invalidAddressProperty
} from '../utils/helpers.jsx';
import { updateAddress } from '../actions/letters';
import Address from '../components/Address';

export class AddressSection extends React.Component {
  constructor() {
    super();
    this.state = { isEditAddressing: false };
  }

  render() {
    const address = this.props.address || {};

    // Street address: first line of address
    const streetAddressLines = [
      address.addressOne,
      address.addressTwo ? `, ${address.addressTwo}` : '',
      address.addressThree ? ` ${address.addressThree}` : ''
    ];
    const streetAddress = streetAddressLines.join('').toLowerCase();

    // City, state, postal code: second line of address
    const country = isInternationalAddress(address) ? address.countryName : '';
    const zipCode = getZipCode(address);
    let cityStatePostal;
    if (isDomesticAddress(address)) {
      const city = (address.city || '').toLowerCase();
      // const state = getStateName(address.stateCode);
      const state = 'XY';
      cityStatePostal = `${city}, ${state} ${zipCode}`;
    } else if (isMilitaryAddress(address)) {
      const militaryPostOfficeTypeCode = address.militaryPostOfficeTypeCode || '';
      const militaryStateCode = address.militaryStateCode || '';
      cityStatePostal = `${militaryPostOfficeTypeCode}, ${militaryStateCode} ${zipCode}`;
    }

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            value={address}
            onUserInput={(addr) => {this.props.updateAddress(addr);}}
            required/>
          <button className="usa-button-primary" onClick={() => this.setState({ isEditingAddress: false })}>Update</button>
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: false })}>Cancel</button>
        </div>
      );
    } else {
      addressFields = (
        <div>
          <div className="letters-address">{streetAddress}</div>
          <div className="letters-address">{cityStatePostal}</div>
          <div className="letters-address">{country}</div>
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: true })}>Edit</button>
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
    } else {
      addressContent = (
        <div className="step-content">
          <p>
            Downloaded documents will list your address as:
          </p>
          <div className="address-block">
            <h5 className="letters-address">{(this.props.fullName || '').toLowerCase()}</h5>
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
  const letterState = state.letters;
  return {
    fullName: letterState.fullName,
    address: letterState.address
  };
}

const mapDispatchToProps = {
  updateAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection);
