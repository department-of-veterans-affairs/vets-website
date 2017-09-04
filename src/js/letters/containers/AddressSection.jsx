import React from 'react';
import { connect } from 'react-redux';
import { pick } from 'lodash/fp/pick';

import {
  isBlankAddress,
  invalidAddressAlert,
  makeAddressField
} from '../utils/helpers.jsx';
import { updateAddress } from '../actions/letters';
import Address from '../components/Address';

export class AddressSection extends React.Component {
  constructor() {
    super();
    this.state = { isEditingAddress: false };
  }

  render() {
    const address = this.props.address || makeAddressField();
    const addressLines = [
      address.addressOne.value,
      address.addressTwo.value ? `, ${address.addressTwo.value}` : '',
      address.addressThree.value ? ` ${address.addressThree.value}` : ''
    ];

    let addressFields;
    if (this.state.isEditingAddress) {
      addressFields = (
        <div>
          <Address
            address
            countries={this.props.countries}
            states={this.props.states}
            onUserInput={(addr) => {this.props.updateAddress(addr);}}
            required/>
          <button className="usa-button-primary" onClick={() => this.setState({ isEditingAddress: false })}>Update</button>
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: false })}>Cancel</button>
        </div>
      );
    } else {
      let editButton;
      if (this.props.referenceDataAvailable) {
        editButton = (
          <button className="usa-button-outline" onClick={() => this.setState({ isEditingAddress: true })}>Edit</button>
        );
      }
      addressFields = (
        <div>
          <div className="letters-address">{addressLines.join('').toLowerCase()}</div>
          <div className="letters-address">{(address.city.value || '').toLowerCase()}, {address.stateCode.value} {(address.zipCode.value || '').toLowerCase()}</div>
          {editButton}
        </div>
      );
    }

    let addressContent;
    if (isBlankAddress(address)) {
      addressContent = (
        <div className="step-content">
          {invalidAddressAlert}
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
  return pick(state.letters,
    ['fullName', 'address', 'countries', 'states', 'referenceDataAvailable']);
}

const mapDispatchToProps = {
  updateAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection);
