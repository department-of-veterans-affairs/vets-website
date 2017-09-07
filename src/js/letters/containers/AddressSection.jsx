import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { invalidAddressProperty } from '../utils/helpers.jsx';
import { updateAddress } from '../actions/letters';
import Address from '../components/Address';

export class AddressSection extends React.Component {
  constructor() {
    super();
    this.state = { isEditAddressing: false };
  }

  render() {
    const address = this.props.address || {};
    const addressLines = [
      address.addressOne,
      address.addressTwo ? `, ${address.addressTwo}` : '',
      address.addressThree ? ` ${address.addressThree}` : ''
    ];

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address value={address} onUserInput={(addr) => {this.props.updateAddress(addr);}} required/>
          <button className="usa-button-primary" onClick={() => this.setState({ isEditingAddress: false })}>Update</button>
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: false })}>Cancel</button>
        </div>
      );
    } else {
      addressFields = (
        <div>
          <div className="letters-address">{addressLines.join('').toLowerCase()}</div>
          {/* TODO: format for display should vary depending on address type, i.e., domestic, military, international */}
          <div className="letters-address">{(address.city || '').toLowerCase()}, {address.state} {(address.zipCode || '').toLowerCase()}</div>
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
