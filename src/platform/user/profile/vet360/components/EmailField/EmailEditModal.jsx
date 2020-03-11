import React from 'react';
import { connect } from 'react-redux';

import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

import { profileUseSchemaForms } from 'vet360/selectors';

import Vet360EditModal from '../base/Vet360EditModal';

import ContactInfoForm from '../ContactInfoForm';

class EmailEditModal extends React.Component {
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
      {this.props.useSchemaForm && (
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
      {!this.props.useSchemaForm && (
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
        onBlur={this.props.useSchemaForm ? null : this.onBlur}
        useSchemaForm={this.props.useSchemaForm}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  useSchemaForm: profileUseSchemaForms(state),
});

export default connect(mapStateToProps)(EmailEditModal);
