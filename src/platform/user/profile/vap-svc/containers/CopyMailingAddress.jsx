import React from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { isEmptyAddress } from 'platform/forms/address/helpers';

import { FIELD_NAMES } from '../constants';

import { selectVAPContactInfoField } from '../selectors';

const ADDRESS_PROPS = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'countryCodeIso3',
  'internationalPostalCode',
  'province',
  'stateCode',
  'zipCode',
];

class CopyMailingAddress extends React.Component {
  onChange = event => {
    event.stopPropagation();
    const shouldClearValues = this.props.hasChecked && !event.target.checked;
    let address;

    // Upon explicit unchecking of 'my home address is the same as my mailing address'
    if (shouldClearValues) {
      address = mapValues(this.props.mailingAddress, () => null);
    }

    if (event.target.checked) {
      address = pick(this.props.mailingAddress, ADDRESS_PROPS);
    }

    this.props.copyMailingAddress(address, this.props.checked);
  };

  render() {
    if (this.props.hasEmptyMailingAddress) return <div />;
    return (
      <div className="copy-mailing-address-to-residential-address">
        <div className="form-checkbox-buttons form-checkbox">
          <input
            type="checkbox"
            name="copy-mailing-address-to-residential-address"
            id="copy-mailing-address-to-residential-address"
            autoComplete="false"
            onChange={this.onChange}
          />
          <label htmlFor="copy-mailing-address-to-residential-address">
            My home address is the same as my mailing address.
          </label>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  const mailingAddress = selectVAPContactInfoField(
    state,
    FIELD_NAMES.MAILING_ADDRESS,
  );
  const hasEmptyMailingAddress = isEmptyAddress(mailingAddress);

  return {
    mailingAddress,
    hasEmptyMailingAddress,
  };
}

export default connect(mapStateToProps)(CopyMailingAddress);
export { CopyMailingAddress };
