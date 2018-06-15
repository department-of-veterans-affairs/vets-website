import React from 'react';
import PhoneNumberWidget from 'us-forms-system/lib/js/review/PhoneNumberWidget';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import PhoneEditModal from './PhoneEditModal';

function renderContent({ data: phoneData }) {
  const phoneNumber = <PhoneNumberWidget value={[phoneData.areaCode, phoneData.phoneNumber].join('')}/>;
  const countryCode = phoneData.countryCode && <span>+ {phoneData.countryCode}</span>;
  const extension = phoneData.extension && <span>x{phoneData.extension}</span>;
  return <div>{countryCode} {phoneNumber} {extension}</div>;
}

function renderEditModal({ data: phoneData, title, field, transactionRequest, clearErrors, onChange, onDelete, onSubmit, onCancel }) {
  return (
    <PhoneEditModal
      title={title.toLowerCase()}
      field={field}
      error={transactionRequest && transactionRequest.error}
      clearErrors={clearErrors}
      onChange={onChange}
      phoneData={phoneData}
      onSubmit={onSubmit}
      isLoading={transactionRequest && transactionRequest.isPending}
      onCancel={onCancel}
      onDelete={onDelete}/>
  );
}

export default function Vet360Phone({ title, fieldName, analyticsSectionName }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      renderContent={renderContent}
      renderEditModal={renderEditModal}/>
  );
}
