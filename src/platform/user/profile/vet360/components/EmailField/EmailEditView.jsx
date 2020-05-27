import React from 'react';

import VAPEditView from '../base/VAPEditView';

import ContactInfoForm from '../ContactInfoForm';

class EmailEditView extends React.Component {
  getInitialFormValues = () =>
    this.props.data ? { ...this.props.data } : { emailAddress: '' };

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
      <VAPEditView
        {...this.props}
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
      />
    );
  }
}

export default EmailEditView;
