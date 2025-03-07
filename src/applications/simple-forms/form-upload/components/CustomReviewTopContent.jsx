import React from 'react';
import { useSelector } from 'react-redux';
import {
  VaTelephone,
  VaFileInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getFormNumber, mask, formattedPhoneNumber } from '../helpers';
import EditLink from './EditLink';

const CustomReviewTopContent = () => {
  const { data: formData } = useSelector(state => state?.form || {});
  const {
    uploadedFile,
    idNumber,
    address,
    fullName,
    phoneNumber,
    email,
  } = formData;

  const renderPersonalInfo = () => (
    <div>
      <div>
        <p className="usa-hint">Name</p>
        <p>
          {fullName.first} {fullName.last}
        </p>
      </div>
      <div>
        <p className="usa-hint">Zip code</p>
        <p>{address.postalCode}</p>
      </div>
      <div>
        <p className="usa-hint">Social security number</p>
        <p>{mask(idNumber?.ssn)}</p>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div>
      {phoneNumber ? (
        <div>
          <p className="usa-hint">Phone number</p>
          <p>{formattedPhoneNumber(phoneNumber)}</p>
        </div>
      ) : null}
      <div>
        <p className="usa-hint">Email</p>
        <p>{email}</p>
      </div>
    </div>
  );

  const formNumber = getFormNumber().toLowerCase();
  const filePayload = {
    name: uploadedFile?.name,
    size: uploadedFile?.size,
    type: '',
  };

  return (
    <>
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Personal information</h3>
        <EditLink
          href={`/${formNumber}/name-and-zip-code`}
          label="Edit Personal information"
        />
      </div>
      {renderPersonalInfo()}
      <p className="vads-u-margin-bottom--5">
        <b>Note:</b> Changes to personal information here won’t apply to your VA
        profile. If you need to update your personal information, please call us
        at <VaTelephone contact="8008271000" />(
        <VaTelephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00am to 9:00pm ET.
      </p>
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Contact information</h3>
        <EditLink
          href={`/${formNumber}/phone-number-and-email`}
          label="Edit Contact information"
        />
      </div>
      {renderContactInfo()}
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Uploaded file</h3>
        <EditLink href={`/${formNumber}/upload`} label="Edit Uploaded file" />
      </div>
      {uploadedFile && <VaFileInput value={filePayload} readOnly uswds />}
    </>
  );
};

export default CustomReviewTopContent;
