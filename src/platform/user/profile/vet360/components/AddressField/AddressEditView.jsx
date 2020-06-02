import React from 'react';
import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';
import ADDRESS_DATA from 'platform/forms/address/data';
import { focusElement } from 'platform/utilities/ui';

import { ADDRESS_POU, FIELD_NAMES, USA } from 'vet360/constants';
import VAPEditView from '../base/VAPEditView';
import CopyMailingAddress from 'vet360/containers/CopyMailingAddress';
import ContactInfoForm from '../ContactInfoForm';

class AddressEditView extends React.Component {
  componentWillUnmount() {
    focusElement(`#${this.props.fieldName}-edit-link`);
  }

  onInput = (value, schema, uiSchema) => {
    const newFieldValue = {
      ...value,
    };
    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
    }
    this.props.onChangeFormDataAndSchemas(newFieldValue, schema, uiSchema);
  };

  getInitialFormValues = () =>
    this.props.modalData ||
    this.transformInitialFormValues(this.props.data) || {
      countryCodeIso3: USA.COUNTRY_ISO3_CODE,
    };

  /**
   * Returns a copy of the input object with an added `view:livesOnMilitaryBase`
   * value if the address is a overseas military mailing address
   *
   */
  livesOnMilitaryBase = data => {
    if (
      data?.addressPou === ADDRESS_POU.CORRESPONDENCE &&
      ADDRESS_DATA.militaryStates.includes(data?.stateCode) &&
      ADDRESS_DATA.militaryCities.includes(data?.city)
    ) {
      return true;
    }
    return false;
  };

  /**
   * Helper function that calls other helpers to:
   * - totally remove data fields that are not set
   * - set the form data's `view:livesOnMilitaryBase` prop to `true` if this is
   *   an overseas military mailing address
   *
   * If the argument is not an object this function will simply return whatever
   * was passed to it.
   */
  transformInitialFormValues = initialFormValues => {
    if (!(initialFormValues instanceof Object)) {
      return initialFormValues;
    }
    // totally removes data fields with falsey values from initialFormValues
    // to prevent form validation errors.
    const transformedData = pickBy(initialFormValues);
    if (this.livesOnMilitaryBase(transformedData)) {
      transformedData['view:livesOnMilitaryBase'] = true;
    }
    return transformedData;
  };

  copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    this.props.onChangeFormDataAndSchemas(
      this.transformInitialFormValues(newAddressValue),
      this.props.field.formSchema,
      this.props.field.uiSchema,
    );
  };

  renderForm = (formButtons, onSubmit) => (
    <div>
      {this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
        <CopyMailingAddress copyMailingAddress={this.copyMailingAddress} />
      )}
      <ContactInfoForm
        formData={this.props.field.value}
        formSchema={this.props.field.formSchema}
        uiSchema={this.props.field.uiSchema}
        onUpdateFormData={this.onInput}
        onSubmit={onSubmit}
      >
        {formButtons}
      </ContactInfoForm>
    </div>
  );

  render() {
    return (
      <VAPEditView
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  modalData: state.vet360?.modalData,
});

export default connect(mapStateToProps)(AddressEditView);
