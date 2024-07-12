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

  return (
    <>
      <div className="vads-u-margin-top--2">
        <div className="vads-u-margin-y--1 vads-u-color--gray">Your file</div>
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
              <span className="vads-u-font-weight--bold">
                {form?.data?.uploadedFile && form?.data.uploadedFile.name}
              </span>{' '}
              <span className="vads-u-color--gray-darker">
                {form?.data?.uploadedFile &&
                  getFileSize(form?.data.uploadedFile.size)}
              </span>
            </div>
          </div>
        </VaCard>
      </div>
      <div className="vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Your personal information</h3>
      </div>
      <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
        <p>
          <b>
            {form?.data?.['view:veteranPrefillStore']?.fullName &&
              `${capitalize(
                form?.data?.['view:veteranPrefillStore']?.fullName.first,
              )} ${capitalize(
                form?.data?.['view:veteranPrefillStore']?.fullName.last,
              )}`}
          </b>
        </p>
        {form?.data?.['view:veteranPrefillStore']?.ssn && (
          <p>
            Social Security number:{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(form?.data?.['view:veteranPrefillStore']?.ssn)}
            </span>
          </p>
        )}
        {form?.data?.['view:veteranPrefillStore']?.zip && (
          <p>Zip code: {form?.data?.['view:veteranPrefillStore']?.zip}</p>
        )}
      </div>
      <p className="vads-u-margin-bottom--5">
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
    </>
  );
};

export default CustomReviewTopContent;
