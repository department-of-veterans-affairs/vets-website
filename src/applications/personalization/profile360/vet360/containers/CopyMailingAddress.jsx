import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import { isEmptyAddress } from '../../../../../platform/forms/address/helpers';

import { FIELD_NAMES } from '../constants';

import { selectVet360Field, selectEditedFormField } from '../selectors';

const ADDRESS_PROPS = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'countryName',
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
        <div className="form-checkbox-buttons">
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

export function mapStateToProps(state, ownProps) {
  const { convertNextValueToCleanData } = ownProps;
  const mailingAddress = selectVet360Field(state, FIELD_NAMES.MAILING_ADDRESS);
  const hasEmptyMailingAddress = isEmptyAddress(mailingAddress);

  const residentialAddress = selectEditedFormField(
    state,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  ).value;

  const checked =
    !hasEmptyMailingAddress &&
    isEqual(
      pick(convertNextValueToCleanData(mailingAddress), ADDRESS_PROPS),
      pick(residentialAddress, ADDRESS_PROPS),
    );

  return {
    mailingAddress,
    hasEmptyMailingAddress,
    checked,
  };
}

export default connect(
  mapStateToProps,
  null,
)(CopyMailingAddress);
export { CopyMailingAddress };
