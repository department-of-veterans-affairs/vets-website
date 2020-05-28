import React from 'react';
import { connect } from 'react-redux';

import VAPEditView from '../base/VAPEditView';

import { isEnrolledInVAHealthCare as isEnrolledInVAHealthCareSelector } from 'applications/hca/selectors';

import { FIELD_NAMES } from 'vet360/constants';

import { profileShowReceiveTextNotifications } from 'applications/personalization/profile360/selectors';

import ContactInfoForm from '../ContactInfoForm';

class PhoneEditView extends React.Component {
  getInitialFormValues = () => {
    let defaultFieldValue;

    if (this.props.data) {
      defaultFieldValue = {
        ...this.props.data,
        inputPhoneNumber: `${this.props.data.areaCode}${
          this.props.data.phoneNumber
        }`,
        extension: this.props.data.extension || '',
        isTextPermitted: this.props.data.isTextPermitted || false,
        'view:showSMSCheckbox': this.props.showSMSCheckbox,
      };
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        inputPhoneNumber: '',
        isTextable: false,
        isTextPermitted: false,
        'view:showSMSCheckbox': this.props.showSMSCheckbox,
      };
    }

    return defaultFieldValue;
  };

  renderForm = (formButtons, onSubmit) => (
    <ContactInfoForm
      formData={this.props.field.value}
      formSchema={this.props.field.formSchema}
      uiSchema={this.props.field.uiSchema}
      onUpdateFormData={this.props.onChangeFormDataAndSchemas}
      onSubmit={onSubmit}
    >
      {formButtons}
    </ContactInfoForm>
  );

  render() {
    return (
      <VAPEditView
        {...this.props}
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
      />
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const showReceiveTextNotifications = profileShowReceiveTextNotifications(
    state,
  );
  const isEnrolledInVAHealthCare = isEnrolledInVAHealthCareSelector(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE &&
    showReceiveTextNotifications &&
    isEnrolledInVAHealthCare;
  return {
    // showReceiveTextNotifications,
    // isEnrolledInVAHealthCare,
    showSMSCheckbox,
  };
}

export default connect(mapStateToProps)(PhoneEditView);
