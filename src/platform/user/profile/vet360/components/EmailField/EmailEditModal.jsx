import React from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

import Vet360EditModal from '../base/Vet360EditModal';

import ContactInfoForm from '../ContactInfoForm';

import environment from 'platform/utilities/environment';

const useNewForm = !environment.isProduction();

export default class EmailEditModal extends React.Component {
  onChange = ({ value: emailAddress, dirty }) => {
    const newFieldValue = { ...this.props.field.value, emailAddress };
    this.props.onChange(newFieldValue, dirty);
  };

  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

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
      {useNewForm && (
        <ContactInfoForm
          formData={this.props.field.value}
          formSchema={this.props.field.formSchema}
          uiSchema={this.props.field.uiSchema}
          onUpdateFormData={this.props.onChangeFormDataAndSchemas}
          onSubmit={onSubmit}
        >
          {formButtons}
        </ContactInfoForm>
      )}
      {!useNewForm && (
        <ErrorableTextInput
          autoFocus
          label="Email Address"
          name="email"
          type="email"
          field={{ value: this.props.field.value.emailAddress, dirty: false }}
          errorMessage={this.props.field.validations.emailAddress}
          onValueChange={this.onChange}
        />
      )}
    </>
  );

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        onBlur={useNewForm ? null : this.onBlur}
        useSchemaForm={useNewForm}
        {...this.props}
      />
    );
  }
}
