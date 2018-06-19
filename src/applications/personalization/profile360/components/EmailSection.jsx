import React from 'react';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import EmailEditModal from './EmailEditModal';

function renderContent({ data: emailData }) {
  return <span>{emailData.emailAddress}</span>;
}

function renderEditModal({ data: emailData, field, transactionRequest, clearErrors, onChange, onSubmit, onCancel, onDelete }) {
  return (
    <EmailEditModal
      title="email address"
      emailData={emailData}
      field={field}
      error={transactionRequest && transactionRequest.error}
      clearErrors={clearErrors}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={transactionRequest && transactionRequest.isPending}
      onCancel={onCancel}
      onDelete={onDelete}/>
  );
}

export default function Vet360Email({ title = 'email address', fieldName = 'email', analyticsSectionName = 'email' }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      renderContent={renderContent}
      renderEditModal={renderEditModal}/>
  );
}
