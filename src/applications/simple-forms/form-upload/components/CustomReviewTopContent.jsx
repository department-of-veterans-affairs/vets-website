import React from 'react';
import { useSelector } from 'react-redux';
import {
  VaTelephone,
  VaFileInput,
  VaFileInputMultiple,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { makePlaceholderFile } from 'platform/forms-system/src/js/web-component-fields';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
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
    supportingDocuments,
  } = formData;

  const renderPersonalInfo = () => (
    <div>
      <ul className="vads-u-padding--0 schemaform-file-list">
        <li>
          <div className="usa-hint">Name</div>
          <div>
            {fullName.first} {fullName.last}
          </div>
        </li>
        <li>
          <div className="usa-hint">Zip code</div>
          <div>{address.postalCode}</div>
        </li>
        <li>
          <div className="usa-hint">Social security number</div>
          <div>{mask(idNumber?.ssn)}</div>
        </li>
      </ul>
    </div>
  );

  const renderContactInfo = () => (
    <ul className="vads-u-padding--0 schemaform-file-list">
      {phoneNumber ? (
        <li>
          <div className="usa-hint">Phone number</div>
          <div>{formattedPhoneNumber(phoneNumber)}</div>
        </li>
      ) : null}
      <li>
        <div className="usa-hint">Email</div>
        <div>{email}</div>
      </li>
    </ul>
  );

  const formNumber = getFormNumber().toLowerCase();
  const filePayload = {
    name: uploadedFile?.name,
    size: uploadedFile?.size,
    type: '',
  };

  const filesForSupportingDocuments =
    Array.isArray(supportingDocuments) && supportingDocuments.length > 0
      ? supportingDocuments.map(document => makePlaceholderFile(document))
      : null;

  return (
    <>
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Veteran’s information</h3>
        <EditLink
          href={`/${formNumber}/name-and-zip-code`}
          label="Edit Veteran’s information"
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
        <h3>Your contact information</h3>
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
      {uploadedFile && <VaFileInput uploadedFile={filePayload} readOnly />}
      {!environment.isProduction() && (
        <>
          <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
            <h3>Uploaded supporting documents</h3>
            <EditLink
              href={`/${formNumber}/supporting-documents`}
              label="Edit Uploaded supporting documents"
            />
          </div>
          {filesForSupportingDocuments ? (
            <VaFileInputMultiple
              value={filesForSupportingDocuments}
              read-only
            />
          ) : (
            <ul className="vads-u-padding--0 schemaform-file-list">
              <li>
                <div className="usa-hint">
                  Do you want to upload supporting documents now?
                </div>
                <div>No</div>
              </li>
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default CustomReviewTopContent;
