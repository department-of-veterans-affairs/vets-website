import React from 'react';
import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';

import {
  ADDRESS_FORM_VALUES,
  ADDRESS_POU,
  ADDRESS_TYPES,
  FIELD_NAMES,
  USA,
} from 'vet360/constants';

import Vet360EditModal from '../base/Vet360EditModal';

import CopyMailingAddress from 'vet360/containers/CopyMailingAddress';
import AddressForm from './AddressForm';
import AddressFormV2 from './AddressFormV2';

import environment from 'platform/utilities/environment';

const useNewAddressForm = !environment.isProduction();

class AddressEditModal extends React.Component {
  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

  onInput = (field, value) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value,
    };
    this.props.onChange(newFieldValue, field, true);
  };

  onInputV2 = (value, schema, uiSchema) => {
    const newFieldValue = {
      ...value,
    };
    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryName = USA.COUNTRY_NAME;
    }
    this.props.onChangeFormDataAndSchemas(newFieldValue, schema, uiSchema);
  };

  getInitialFormValues = () =>
    this.props.modalData ||
    this.transformInitialFormValues(this.props.data) || {
      countryName: USA.COUNTRY_NAME,
    };

  getIsMailingAddress = () =>
    this.props.fieldName === FIELD_NAMES.MAILING_ADDRESS;

  /**
   * Returns a copy of the input object with keys removed for values that are
   * falsy
   *
   */
  removeEmptyKeys = data =>
    pickBy(
      {
        id: data.id,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3,
        addressType: data.addressType,
        city: data.city,
        countryName: data.countryName,
        stateCode: data.stateCode,
        internationalPostalCode: data.internationalPostalCode,
        zipCode: data.zipCode,
        province: data.province,
        addressPou: data.Pou,
      },
      e => !!e,
    );

  /**
   * Returns a copy of the input object with an added `view:livesOnMilitaryBase`
   * value if the address is a overseas military mailing address
   *
   */
  selectLivesOnMilitaryBaseCheckbox = data => {
    if (
      data?.addressPou === ADDRESS_POU.CORRESPONDENCE &&
      data?.addressType === ADDRESS_TYPES.OVERSEAS_MILITARY
    ) {
      return { ...data, 'view:livesOnMilitaryBase': true };
    }
    return data;
  };

  /**
   * Helper function that:
   * - totally removes data fields that are not set
   * - sets the form data's `view:livesOnMilitaryBase` prop to `true` if this is
   *   an overseas military mailing address
   */
  transformInitialFormValues = initialFormValues => {
    let transformedData = this.removeEmptyKeys(initialFormValues);
    transformedData = this.selectLivesOnMilitaryBaseCheckbox(transformedData);
    return transformedData;
  };

  copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    if (useNewAddressForm) {
      this.props.onChangeFormDataAndSchemas(
        newAddressValue,
        this.props.field.formSchema,
        this.props.field.uiSchema,
      );
    } else {
      this.props.onChange(newAddressValue, null, true);
    }
  };

  renderForm = (formButtons, onSubmit) => (
    <div>
      {this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
        <CopyMailingAddress
          convertNextValueToCleanData={this.props.convertNextValueToCleanData}
          copyMailingAddress={this.copyMailingAddress}
          useNewAddressForm={useNewAddressForm}
        />
      )}
      {useNewAddressForm && (
        <AddressFormV2
          address={this.props.field.value}
          formSchema={this.props.field.formSchema}
          uiSchema={this.props.field.uiSchema}
          onUpdateFormData={this.onInputV2}
          onSubmit={onSubmit}
        >
          {formButtons}
        </AddressFormV2>
      )}
      {!useNewAddressForm && (
        <AddressForm
          isMailingAddress={this.getIsMailingAddress()}
          address={this.props.field.value}
          onInput={this.onInput}
          onBlur={this.onBlur}
          errorMessages={this.props.field.validations}
          states={ADDRESS_FORM_VALUES.STATES}
          countries={ADDRESS_FORM_VALUES.COUNTRIES}
        />
      )}
    </div>
  );

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        onBlur={useNewAddressForm ? null : this.onBlur}
        render={this.renderForm}
        useNewAddressForm={useNewAddressForm}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  modalData: state.vet360?.modalData,
});

export default connect(mapStateToProps)(AddressEditModal);
