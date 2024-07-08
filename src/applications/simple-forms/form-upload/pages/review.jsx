import React from 'react';
import { capitalize } from 'lodash';
import { mask } from '../helpers';

const userInfoReview = (fullName, veteran) => {
  return Object.freeze(
    <>
      <p className="vads-u-margin-top--0">
        When you submit your form, we’ll include the following personal
        information so that you can track your submission’s status.
      </p>
      <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
        <p>
          <b>
            {capitalize(fullName.first)} {capitalize(fullName.last)}
          </b>
        </p>
        {veteran && (
          <>
            <p>
              Social Security number:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {mask(veteran.ssn)}
              </span>
            </p>
            <p>Zip code: {veteran.address?.postalCode}</p>
          </>
        )}
      </div>
      <p className="vads-u-margin-bottom--5">
        <b>Note:</b> If you need to update your personal information, call us at
        800-827-1000 (TTY:711). We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
    </>,
  );
};

export const reviewPage = (fullName, veteran) => {
  return {
    uiSchema: {
      'view:userInfoReview': {
        'ui:description': userInfoReview(fullName, veteran),
      },
    },
    schema: {
      type: 'object',
      properties: {
        'view:userInfoReview': {
          type: 'object',
          properties: {},
        },
      },
    },
  };
};
