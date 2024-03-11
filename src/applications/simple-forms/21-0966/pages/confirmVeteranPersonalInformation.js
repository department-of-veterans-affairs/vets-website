import React from 'react';
import moment from 'moment';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */

export default {
  uiSchema: {
    ...titleUI(
      'Confirm the personal information we have on file for you',
      ({ formData }) => (
        <>
          <div className="vads-u-border-left--7px vads-u-border-color--primary vads-u-margin-top--3">
            <div className="vads-u-padding-left--1">
              <p className="vads-u-margin--1px">
                <strong>
                  {formData?.['view:veteranPrefillStore']?.fullName?.first}{' '}
                  {formData?.['view:veteranPrefillStore']?.fullName?.last}
                </strong>
              </p>
              <p className="vads-u-margin--1px">
                Social Security number: ●●●–●●–
                {formData?.['view:veteranPrefillStore']?.ssn?.slice(5)}
              </p>
              <p className="vads-u-margin--1px">
                Date of birth:{' '}
                {moment(
                  formData?.['view:veteranPrefillStore']?.dateOfBirth,
                  'YYYY-MM-DD',
                ).format('MM/DD/YYYY')}
              </p>
            </div>
          </div>
          <p>
            <strong>Note</strong>: If you need to update your personal
            information, you can call us at{' '}
            <va-telephone contact="8008271000" />. We’re here Monday through
            Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </>
      ),
    ),
    'view:confirmVeteranPersonalInformation': {
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:confirmVeteranPersonalInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};
