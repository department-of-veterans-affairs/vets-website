import React from 'react';
import { connect } from 'react-redux';

import ContactInformationEditView from '@@profile/components/personal-information/ContactInformationEditView';

import { isVAPatient } from '~/platform/user/selectors';

import { FIELD_NAMES } from '@@vap-svc/constants';

import ContactInfoForm from '@@vap-svc/components/ContactInfoForm';

class PhoneEditView extends React.Component {
  getInitialFormValues = () => {
    let initialFormValues = {
      countryCode: '1',
      extension: '',
      inputPhoneNumber: '',
      isTextable: false,
      isTextPermitted: false,
      'view:showSMSCheckbox': this.props.showSMSCheckbox,
    };

    if (this.props.data) {
      const {
        data,
        data: { extension, areaCode, phoneNumber, isTextPermitted },
        showSMSCheckbox,
      } = this.props;
      initialFormValues = {
        ...data,
        extension: extension || '',
        inputPhoneNumber: `${areaCode}${phoneNumber}`,
        isTextPermitted: isTextPermitted || false,
        'view:showSMSCheckbox': showSMSCheckbox,
      };
    }

    return initialFormValues;
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
      <ContactInformationEditView
        {...this.props}
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
      />
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const isEnrolledInVAHealthCare = isVAPatient(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE && isEnrolledInVAHealthCare;
  return { showSMSCheckbox };
}

export default connect(mapStateToProps)(PhoneEditView);
