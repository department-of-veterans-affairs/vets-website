import React from 'react';
import PhoneNumberWidget from 'us-forms-system/lib/js/review/PhoneNumberWidget';

import Vet360ProfileField from '../../containers/Vet360ProfileField';
import PhoneEditModal from './EditModal';

function PhoneView({ data: phoneData }) {
  const phoneNumber = <PhoneNumberWidget value={[phoneData.areaCode, phoneData.phoneNumber].join('')}/>;
  const countryCode = phoneData.countryCode && <span>+ {phoneData.countryCode}</span>;
  const extension = phoneData.extension && <span>x{phoneData.extension}</span>;
  return <div>{countryCode} {phoneNumber} {extension}</div>;
}

export default function Vet360Phone({ title, fieldName, analyticsSectionName }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      Content={PhoneView}
      EditModal={PhoneEditModal}/>
  );
}
