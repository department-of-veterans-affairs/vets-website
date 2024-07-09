import React from 'react';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { capitalize } from 'lodash';
import { mask } from '../helpers';

export const reviewPage = {
  uiSchema: {
    ...titleUI('', ({ formData }) => (
      <>
        <p className="vads-u-margin-top--0">
          When you submit your form, we’ll include the following personal
          information so that you can track your submission’s status.
        </p>
        <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
          <p>
            <b>
              {formData?.['view:veteranPrefillStore']?.fullName &&
                `${capitalize(
                  formData?.['view:veteranPrefillStore']?.fullName.first,
                )} ${capitalize(
                  formData?.['view:veteranPrefillStore']?.fullName.last,
                )}`}
            </b>
          </p>
          {formData?.['view:veteranPrefillStore']?.ssn && (
            <p>
              Social Security number:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {mask(formData?.['view:veteranPrefillStore']?.ssn)}
              </span>
            </p>
          )}
          {formData?.['view:veteranPrefillStore']?.zip && (
            <p>Zip code: {formData?.['view:veteranPrefillStore']?.zip}</p>
          )}
        </div>
        <p className="vads-u-margin-bottom--5">
          <b>Note:</b> If you need to update your personal information, call us
          at 800-827-1000 (TTY:711). We’re here Monday through Friday, 8:00am to
          9:00pm ET.
        </p>
      </>
    )),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
