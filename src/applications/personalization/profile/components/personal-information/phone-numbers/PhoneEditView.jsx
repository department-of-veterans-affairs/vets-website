import React from 'react';
import { connect } from 'react-redux';

import ContactInformationEditView from '@@profile/components/personal-information/ContactInformationEditView';

import { isVAPatient } from '~/platform/user/selectors';

import { FIELD_NAMES } from '@@vap-svc/constants';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

class PhoneEditView extends React.Component {
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
            'phone',
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
        type="phone"
      />
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const isEnrolledInVAHealthCare = isVAPatient(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE && isEnrolledInVAHealthCare;
  return { showSMSCheckbox };
}

export default connect(mapStateToProps)(PhoneEditView);
