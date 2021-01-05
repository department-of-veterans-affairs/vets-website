import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import { isEmptyAddress } from 'platform/forms/address/helpers';

import { FIELD_NAMES, USA } from '@@vap-svc/constants';

import { selectVAPContactInfoField, selectEditedFormField } from '../selectors';

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
  static propTypes = {
    emptyMailingAddress: PropTypes.bool.isRequired,
    mailingAddress: PropTypes.object.isRequired,
    residentialAddress: PropTypes.object.isRequired,
  };

  areHomeMailingAddressesEqual = () => {
    const { mailingAddress, residentialAddress } = this.props;

    const mailingAddressFields = pickBy(
      pick(mailingAddress, ADDRESS_PROPS),
      value => !!value,
    );
    const residentialAddressFields = pickBy(
      pick(residentialAddress, ADDRESS_PROPS),
      value => !!value,
    );

    return isEqual(mailingAddressFields, residentialAddressFields);
  };

  onChange = () => {
    const {
      copyMailingAddress,
      mailingAddress,
      residentialAddress,
    } = this.props;

    // If mailing + home addresses are the same, clear the home address
    if (this.areHomeMailingAddressesEqual()) {
      const clearedHomeAddress = mapValues(mailingAddress, () => null);

      // We need the id to remain the same to prevent POST calls
      clearedHomeAddress.id = residentialAddress?.id || null;
      clearedHomeAddress.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;

      copyMailingAddress(clearedHomeAddress);
      return;
    }

    // Otherwise, make the home address the same as the mailing address
    const copiedHomeAddress = pick(mailingAddress, ADDRESS_PROPS);
    copyMailingAddress(copiedHomeAddress);
  };

  render() {
    const { areHomeMailingAddressesEqual, onChange } = this;

    if (this.props.emptyMailingAddress) {
      return <div />;
    }

    return (
      <div className="copy-mailing-address-to-residential-address">
        <div className="form-checkbox-buttons form-checkbox">
          <input
            autoComplete="false"
            checked={areHomeMailingAddressesEqual()}
            id="copy-mailing-address-to-residential-address"
            name="copy-mailing-address-to-residential-address"
            onChange={onChange}
            type="checkbox"
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
  return {
    emptyMailingAddress: isEmptyAddress(mailingAddress),
    residentialAddress: selectEditedFormField(
      state,
      FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ).value,
    mailingAddress,
  };
}

export default connect(mapStateToProps)(CopyMailingAddress);
export { CopyMailingAddress };
