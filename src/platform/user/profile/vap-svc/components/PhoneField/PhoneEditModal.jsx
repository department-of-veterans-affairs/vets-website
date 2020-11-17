import React from 'react';
import { connect } from 'react-redux';

import VAPServiceEditModal from '../base/VAPServiceEditModal';

import { isVAPatient } from 'platform/user/selectors';

import { FIELD_NAMES } from '@@vap-svc/constants';

import ContactInfoForm from '../ContactInfoForm';

class PhoneEditModal extends React.Component {
  // @todo Add propTypes

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
      <VAPServiceEditModal
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
  return {
    showSMSCheckbox,
  };
}

const PhoneEditModalContainer = connect(mapStateToProps)(PhoneEditModal);

export default PhoneEditModalContainer;
