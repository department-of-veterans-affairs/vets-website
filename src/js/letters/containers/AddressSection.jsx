import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { invalidAddressProperty } from '../utils/helpers.jsx';
import Address from '../components/Address';

export class AddressSection extends React.Component {
  constructor() {
    super();
    this.state = { editAddress: false };
  }

  render() {
    const destination = this.props.destination || {};
    const addressLines = [
      destination.addressLine1,
      destination.addressLine2 ? `, ${destination.addressLine2}` : '',
      destination.addressLine3 ? ` ${destination.addressLine3}` : ''
    ];

    let addressFields;
    if (this.state.editAddress) {
      addressFields = (
        <div>
          <Address value={destination} onUserInput={{}} required/>
          <button className="usa-button-primary" onClick={() => this.setState({ editAddress: false })}>Update</button>
          <button className="usa-button-outline" onClick={() => this.setState({ editAddress: false })}>Cancel</button>
        </div>
      );
    } else {
      addressFields = (
        <div>
          <div className="letters-address">{addressLines.join('').toLowerCase()}</div>
          <div className="letters-address">{(destination.city || '').toLowerCase()}, {destination.state} {(destination.zipCode || '').toLowerCase()}</div>
          <button className="usa-button-outline" onClick={() => this.setState({ editAddress: true })}>Edit</button>
        </div>
      );
    }

    let addressContent;
    if (isEmpty(destination)) {
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
            <h5 className="letters-address">{(destination.fullName || '').toLowerCase()}</h5>
            {addressFields}
          </div>
          <div>A correct address is not required to download, but you can update it if you want to./</div>
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
    destination: letterState.destination,
  };
}

export default connect(mapStateToProps)(AddressSection);
