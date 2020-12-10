import React from 'react';
import { connect } from 'react-redux';
import { focusElement } from '~/platform/utilities/ui';

import ContactInformationEditView from '../ContactInformationEditView';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

class AddressEditView extends React.Component {
  componentWillUnmount() {
    focusElement(`#${this.props.fieldName}-edit-link`);
  }

  render() {
    return (
      <ContactInformationEditView
        analyticsSectionName={this.props.analyticsSectionName}
        clearErrors={this.props.clearErrors}
        deleteDisabled={this.props.deleteDisabled}
        field={this.props.field}
        fieldName={this.props.fieldName}
        formSchema={this.props.formSchema}
        getInitialFormValues={() =>
          getInitialFormValues({
            type: 'address',
            data: this.props.data,
            showSMSCheckbox: this.props.showSMSCheckbox,
            modalData: this.props.modalData,
          })
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
        type="address"
      />
    );
  }
}

const mapStateToProps = state => ({
  modalData: state.vapService?.modalData,
});

export default connect(mapStateToProps)(AddressEditView);
