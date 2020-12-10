import React from 'react';

import ContactInformationEditView from '../ContactInformationEditView';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

const EmailEditView = props => (
  <ContactInformationEditView
    analyticsSectionName={props.analyticsSectionName}
    clearErrors={props.clearErrors}
    deleteDisabled={props.deleteDisabled}
    field={props.field}
    formSchema={props.formSchema}
    getInitialFormValues={() =>
      getInitialFormValues({
        type: 'email',
        data: props.data,
        showSMSCheckbox: props.showSMSCheckbox,
      })
    }
    hasUnsavedEdits={props.hasUnsavedEdits}
    hasValidationError={props.hasValidationError}
    isEmpty={props.isEmpty}
    onCancel={props.onCancel}
    onChangeFormDataAndSchemas={props.onChangeFormDataAndSchemas}
    onDelete={props.onDelete}
    onSubmit={props.onSubmit}
    refreshTransaction={props.refreshTransaction}
    title={props.title}
    transaction={props.transaction}
    transactionRequest={props.transactionRequest}
    uiSchema={props.uiSchema}
    type="email"
  />
);

export default EmailEditView;
