import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  getStateName,
  getZipCode,
  isDomesticAddress,
  isMilitaryAddress,
  isInternationalAddress,
} from '../utils/helpers.jsx';
import { saveAddress } from '../actions/letters';
import Address from '../components/Address';
import InvalidAddress from '../components/InvalidAddress';
import AddressContent from '../components/AddressContent';

export class AddressSection extends React.Component {
  constructor() {
    super();
    this.state = {
      hasLoadedAddress: false,
      isEditingAddress: false,
      editableAddress: {},
    };
  }

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
      // reset state code when user changes address country but don't add or
      // modify state property otherwise
      return (path === 'country'
        ? { editableAddress: {
          ...editableAddress,
          [path]: update,
          state: '',
        } }
        : { editableAddress: {
          ...editableAddress,
          [path]: update,
        } }
      );
    });
  }

  render() {
    // We want to use the Redux address as source of truth. Address in
    // container state is only used to control the form input for the
    // <Address/> component
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

    return (
      <div>
        { isEmpty(address)
          ? <InvalidAddress/>
          : <AddressContent
            saveError={this.props.saveAddressError}
            name={(this.props.recipientName || '').toLowerCase()}
            addressObject={addressContentLines}>
            {addressFields}
          </AddressContent>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fullName, address, canUpdate, saveAddressError } = state.letters;
  return {
    recipientName: fullName,
    canUpdate,
    savedAddress: address,
    saveAddressError,
  };
}

const mapDispatchToProps = {
  saveAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection);
