import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

import { isEmptyAddress } from 'platform/forms/address/helpers';

import { FIELD_NAMES } from '../constants';

import { selectVet360Field, selectEditedFormField } from '../selectors';

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
    if (event.target.checked) {
      const address = pick(this.props.mailingAddress, ADDRESS_PROPS);
      this.props.copyMailingAddress(address);
    }
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
            checked={this.props.checked}
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
  const mailingAddress = selectVet360Field(state, FIELD_NAMES.MAILING_ADDRESS);
  const hasEmptyMailingAddress = isEmptyAddress(mailingAddress);

  const residentialAddress = selectEditedFormField(
    state,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  ).value;

  const isChecked = () => {
    if (hasEmptyMailingAddress) {
      return false;
    }
    return isEqual(
      pickBy(pick(mailingAddress, ADDRESS_PROPS), e => !!e),
      pick(residentialAddress, ADDRESS_PROPS),
    );
  };

  return {
    mailingAddress,
    hasEmptyMailingAddress,
    checked: isChecked(),
  };
}

export default connect(mapStateToProps)(CopyMailingAddress);
export { CopyMailingAddress };
