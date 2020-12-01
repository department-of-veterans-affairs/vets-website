import React from 'react';

import ContactInformationEditView from '../ContactInformationEditView';
import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';

class EmailEditView extends React.Component {
  render() {
    return (
      <ContactInformationEditView
        analyticsSectionName={this.props.analyticsSectionName}
        clearErrors={this.props.clearErrors}
        deleteDisabled={this.props.deleteDisabled}
        field={this.props.field}
        formSchema={this.props.formSchema}
        getInitialFormValues={getInitialFormValues({
          type: 'email',
          data: this.props.data,
        })}
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
