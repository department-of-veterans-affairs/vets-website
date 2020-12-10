import React from 'react';

import ContactInformationEditView from '../ContactInformationEditView';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

class EmailEditView extends React.Component {
  getInitialFormValues = () =>
    this.props.data ? { ...this.props.data } : { emailAddress: '' };

  render() {
    return (
      <ContactInformationEditView
        analyticsSectionName={this.props.analyticsSectionName}
        clearErrors={this.props.clearErrors}
        deleteDisabled={this.props.deleteDisabled}
        field={this.props.field}
        formSchema={this.props.formSchema}
        getInitialFormValues={() =>
          getInitialFormValues(
            'email',
            this.props.data,
            this.props.showSMSCheckbox,
          )
        }
        hasUnsavedEdits={this.props.hasUnsavedEdits}
        hasValidationError={this.props.hasValidationError}
        isEmpty={this.props.isEmpty}
        onCancel={this.props.onCancel}
        onChangeFormDataAndSchemas={this.props.onChangeFormDataAndSchemas}
        onDelete={this.props.onDelete}
        onSubmit={this.props.onSubmit}
        refreshTransaction={this.props.refreshTransaction}
        title={this.props.title}
        transaction={this.props.transaction}
        transactionRequest={this.props.transactionRequest}
        uiSchema={this.props.uiSchema}
        type="email"
      />
    );
  }
}

export default EmailEditView;
