import React from 'react';
import { connect } from 'react-redux';

import ContactInformationEditView from '@@profile/components/personal-information/ContactInformationEditView';

import { isVAPatient } from '~/platform/user/selectors';

import { FIELD_NAMES } from '@@vap-svc/constants';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

const PhoneEditView = props => (
  <ContactInformationEditView
    analyticsSectionName={props.analyticsSectionName}
    clearErrors={props.clearErrors}
    deleteDisabled={props.deleteDisabled}
    field={props.field}
    formSchema={props.formSchema}
    getInitialFormValues={() =>
      getInitialFormValues({
        type: 'phone',
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
    type="phone"
  />
);

export function mapStateToProps(state, ownProps) {
  const isEnrolledInVAHealthCare = isVAPatient(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE && isEnrolledInVAHealthCare;
  return { showSMSCheckbox };
}

export default connect(mapStateToProps)(PhoneEditView);
