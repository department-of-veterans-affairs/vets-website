import React from 'react';

import ContactInformationEditView from '../ContactInformationEditView';

import ContactInfoForm from '@@vap-svc/components/ContactInfoForm';

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
      <ContactInformationEditView
        analyticsSectionName={this.props.analyticsSectionName}
        clearErrors={this.props.clearErrors}
        deleteDisabled={this.props.deleteDisabled}
        field={this.props.field}
        formSchema={this.props.formSchema}
        getInitialFormValues={this.getInitialFormValues}
        hasUnsavedEdits={this.props.hasUnsavedEdits}
        hasValidationError={this.props.hasValidationError}
        isEmpty={this.props.isEmpty}
        onCancel={this.props.onCancel}
        onChangeFormDataAndSchemas={this.props.onChangeFormDataAndSchemas}
        onDelete={this.props.onDelete}
        onSubmit={this.props.onSubmit}
        refreshTransaction={this.props.refreshTransaction}
        render={this.renderForm}
        title={this.props.title}
        transaction={this.props.transaction}
        transactionRequest={this.props.transactionRequest}
        uiSchema={this.props.uiSchema}
      />
    );
  }
}

export default EmailEditView;
