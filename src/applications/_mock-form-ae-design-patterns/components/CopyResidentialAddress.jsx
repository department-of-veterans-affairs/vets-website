import React from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import { isEmptyAddress } from 'platform/forms/address/helpers';
import { areAddressesEqual } from 'platform/user/profile/vap-svc/util';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { updateFormFieldWithSchema } from 'platform/user/profile/vap-svc/actions';

import {
  FIELD_NAMES,
  ADDRESS_PROPS,
  USA,
} from 'platform/user/profile/vap-svc/constants';

import {
  selectVAPContactInfoField,
  selectEditedFormField,
} from '@@vap-svc/selectors';
import mapValues from 'lodash/mapValues';

class CopyResidentialAddress extends React.Component {
  areHomeMailingAddressesEqual = () => {
    const { mailingAddress, residentialAddress } = this.props;

    return areAddressesEqual(mailingAddress, residentialAddress);
  };

  onChange = () => {
    const {
      copyResidentialAddress,
      residentialAddress,
      mailingAddressFormSchema,
      mailingAddressUiSchema,
      mailingAddress,
    } = this.props;

    // If mailing + home addresses are the same, clear the home address
    if (this.areHomeMailingAddressesEqual()) {
      const clearedAddress = mapValues(mailingAddress, () => null);

      // We need the id to remain the same to prevent POST calls
      clearedAddress.id = mailingAddress?.id || null;
      clearedAddress.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;

      copyResidentialAddress(
        clearedAddress,
        mailingAddressFormSchema,
        mailingAddressUiSchema,
      );
      return;
    }

    // Otherwise, make the home address the same as the mailing address
    const copiedResidentialAddress = pick(residentialAddress, ADDRESS_PROPS);
    copyResidentialAddress(
      copiedResidentialAddress,
      mailingAddressFormSchema,
      mailingAddressUiSchema,
    );
  };

  render() {
    const { areHomeMailingAddressesEqual, onChange } = this;

    if (this.props.emptyResidentialAddress) {
      return null;
    }

    return (
      <div className="vads-u-background-color--primary-alt-lightest vads-u-padding-y--2 vads-u-padding-left--3">
        <div className="form-checkbox-buttons form-checkbox">
          <VaCheckbox
            checked={areHomeMailingAddressesEqual()}
            label="Use my home address for my mailing address."
            onVaChange={onChange}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  const residentialAddress = selectVAPContactInfoField(
    state,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  );

  const mailingAddressFormField = selectEditedFormField(
    state,
    FIELD_NAMES.MAILING_ADDRESS,
  );

  return {
    emptyResidentialAddress: isEmptyAddress(residentialAddress),
    mailingAddress: mailingAddressFormField?.value,
    mailingAddressFormSchema: mailingAddressFormField?.formSchema,
    mailingAddressUiSchema: mailingAddressFormField?.uiSchema,
    residentialAddress,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    copyResidentialAddress: (address, schema, uiSchema) =>
      dispatch(
        updateFormFieldWithSchema(
          FIELD_NAMES.MAILING_ADDRESS,
          address,
          schema,
          uiSchema,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyResidentialAddress);
