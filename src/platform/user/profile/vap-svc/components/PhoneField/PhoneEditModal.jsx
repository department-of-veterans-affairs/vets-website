import React from 'react';

import VAPServiceEditModal from '../base/VAPServiceEditModal';

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
      };
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        inputPhoneNumber: '',
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

export default PhoneEditModal;
