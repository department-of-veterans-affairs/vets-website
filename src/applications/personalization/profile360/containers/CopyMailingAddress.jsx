import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import {
  isEmptyAddress
} from '../../../../platform/forms/address/helpers';

import {
  FIELD_NAMES
} from '../constants/vet360';

import {
  selectVet360Field,
  selectEditedFormField
} from '../selectors';

import {
  cleanAddressDataForUpdate
} from '../actions/misc';

class CopyMailingAddress extends React.Component {
  onChange = (event) => {
    event.stopPropagation();
    if (event.target.checked) {
      this.props.copyMailingAddress(this.props.mailingAddress);
    }
  }

  render() {
    if (this.props.hasEmptyMailingAddress) return <div/>;
    return (
      <div className="copy-mailing-address-to-residential-address">
        <div className="form-checkbox-buttons">
          <input
            type="checkbox"
            name="copy-mailing-address-to-residential-address"
            id="copy-mailing-address-to-residential-address"
            autoComplete="false"
            checked={this.props.checked}
            onChange={this.onChange}/>
          <label htmlFor="copy-mailing-address-to-residential-address">
            My home address is the same as my mailing address.
          </label>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  const addressProps = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'addressPou',
    'addressType',
    'city',
    'countryName',
    'internationalPostalCode',
    'province',
    'stateCode',
    'zipCode'
  ];

  const mailingAddress = selectVet360Field(state, FIELD_NAMES.MAILING_ADDRESS);
  const hasEmptyMailingAddress = isEmptyAddress(mailingAddress);

  const residentialAddress = selectEditedFormField(state, FIELD_NAMES.RESIDENTIAL_ADDRESS).value;

  const checked = !hasEmptyMailingAddress && isEqual(
    pick(cleanAddressDataForUpdate(mailingAddress), addressProps),
    pick(residentialAddress, addressProps)
  );

  return {
    mailingAddress,
    hasEmptyMailingAddress,
    checked
  };
}

export default connect(mapStateToProps, null)(CopyMailingAddress);
export { CopyMailingAddress };
