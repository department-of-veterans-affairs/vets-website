import React from 'react';
import { useSelector } from 'react-redux';
import {
  VaCard,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { capitalize } from 'lodash';
import { getFileSize, mask } from '../helpers';

const CustomReviewTopContent = () => {
  const { form } = useSelector(state => state || {});
  const prefillStore = form?.data?.['view:veteranPrefillStore'];
  const { uploadedFile, idNumber, address } = form?.data;

  const fullName = prefillStore?.fullName || {};
  const zipCode = prefillStore?.zipCode || address?.postalCode;
  const ssn = prefillStore?.ssn || idNumber?.ssn;
  const vaFileNumber = prefillStore?.vaFileNumber || idNumber?.vaFileNumber;

  const renderFileInfo = file => (
    <VaCard style={{ maxWidth: '75%' }}>
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
          <span className="vads-u-font-weight--bold">{file.name}</span>
          <span className="vads-u-color--gray-darker">
            {getFileSize(file.size)}
          </span>
        </div>
      </div>
    </VaCard>
  );

  const renderPersonalInfo = () => (
    <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
      <p>
        <b>
          {fullName.first &&
            `${capitalize(fullName.first)} ${capitalize(fullName.last)}`}
        </b>
      </p>
      {ssn && (
        <p>
          Social Security number:
          <span className="dd-privacy-mask" data-dd-action-name="Veteran's SSN">
            {mask(ssn)}
          </span>
        </p>
      )}
      {vaFileNumber && <p>VA file number: {vaFileNumber}</p>}
      {zipCode && <p>Zip code: {zipCode}</p>}
    </div>
  );

  return (
    <>
      <div className="vads-u-margin-top--2">
        <div className="vads-u-margin-y--1 vads-u-color--gray">Your file</div>
        {uploadedFile && renderFileInfo(uploadedFile)}
      </div>
      <div className="vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Your personal information</h3>
      </div>
      {renderPersonalInfo()}
      <p className="vads-u-margin-bottom--5">
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
    </>
  );
};

export default CustomReviewTopContent;
