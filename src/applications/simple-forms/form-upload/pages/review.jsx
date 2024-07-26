import React from 'react';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { capitalize } from 'lodash';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { mask } from '../helpers';

export const reviewPage = {
  uiSchema: {
    ...titleUI('', ({ formData = {} }) => {
      const { fullName, idNumber, address } = formData.veteran;
      return (
        <>
          <p className="vads-u-margin-top--0">
            When you submit your form, we’ll include the following personal
            information so that you can track your submission’s status.
          </p>
          <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
            <p>
              <b>
                {fullName &&
                  `${capitalize(fullName.first)} ${capitalize(fullName.last)}`}
              </b>
            </p>
            {idNumber?.ssn && (
              <p>
                Social Security number:{' '}
                <span
                  className="dd-privacy-mask"
                  data-dd-action-name="Veteran's SSN"
                >
                  {mask(idNumber.ssn)}
                </span>
              </p>
            )}
            {address?.postalCode && <p>Zip code: {address.postalCode}</p>}
          </div>
          <p className="vads-u-margin-bottom--5">
            <b>Note:</b> If you need to update your personal information, call
            us at <va-telephone contact="8008271000" /> (TTY:
            <span className="vads-u-padding-left--0p5">
              <va-telephone contact={CONTACTS[711]} />
            </span>
            ). We’re here Monday through Friday, 8:00am to 9:00pm ET.
          </p>
        </>
      );
    }),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
