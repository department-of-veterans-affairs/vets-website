import React from 'react';
import { useSelector } from 'react-redux';
import {
  VaCard,
  VaIcon,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  getFileSize,
  getFormNumber,
  mask,
  formattedPhoneNumber,
} from '../helpers';
import EditLink from './EditLink';

const CustomReviewTopContent = () => {
  const { form } = useSelector(state => state || {});
  const {
    uploadedFile,
    veteranSsn,
    address,
    veteranFullName,
    phoneNumber,
    email,
  } = form?.data;

  const renderFileInfo = file => (
    <div className="vads-l-col--12 medium-screen:vads-l-col--12 small-desktop-screen:vads-l-col--8">
      <VaCard>
        <div className="vads-u-display--flex vads-u-flex-direction--row">
          <span className="vads-u-color--primary">
            <VaIcon
              size={6}
              icon="file_present"
              className="vads-u-margin-right--1"
              srtext="icon representing a file"
              aria-hidden="true"
            />
          </span>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span
              className="vads-u-font-weight--bold"
              style={{ 'word-break': 'break-all' }}
            >
              {file.name}
            </span>
            <span className="vads-u-color--gray-darker">
              {getFileSize(file.size)}
            </span>
          </div>
        </div>
      </VaCard>
    </div>
  );

  const renderPersonalInfo = () => (
    <div>
      <div>
        <p className="usa-hint">Name</p>
        <p>
          {veteranFullName.first} {veteranFullName.last}
        </p>
      </div>
      <div>
        <p className="usa-hint">Zip code</p>
        <p>{address.postalCode}</p>
      </div>
      <div>
        <p className="usa-hint">Social security number</p>
        <p>{mask(veteranSsn)}</p>
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

  return (
    <>
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Personal information</h3>
        <EditLink
          href={`/${getFormNumber()}/name-and-zip-code`}
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
          href={`/${getFormNumber()}/phone-number-and-email`}
          label="Edit Contact information"
        />
      </div>
      {renderContactInfo()}
      <div className="vads-u-display--flex vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Uploaded file</h3>
        <EditLink
          href={`/${getFormNumber()}/upload`}
          label="Edit Uploaded file"
        />
      </div>
      {uploadedFile && renderFileInfo(uploadedFile)}
    </>
  );
};

export default CustomReviewTopContent;
