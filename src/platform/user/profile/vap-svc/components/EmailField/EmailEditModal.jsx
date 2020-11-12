import React from 'react';

import VAPServiceEditModal from '../base/VAPServiceEditModal';

import ContactInfoForm from '../ContactInfoForm';

class EmailEditModal extends React.Component {
  getInitialFormValues = () => {
    if (this.props.data) {
      return { ...this.props.data };
    }
    return {
      emailAddress: '',
    };
  };

  renderForm = (formButtons, onSubmit) => (
    <>
      <ContactInfoForm
        formData={this.props.field.value}
        formSchema={this.props.field.formSchema}
        uiSchema={this.props.field.uiSchema}
        onUpdateFormData={this.props.onChangeFormDataAndSchemas}
        onSubmit={onSubmit}
      >
        {formButtons}
      </ContactInfoForm>
    </>
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

export default EmailEditModal;
