import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import facilityLocator from '~/applications/facility-locator/manifest.json';

import {
  DECEASED_ERROR_CODES,
  INVALID_EMAIL_ADDRESS_ERROR_CODES,
  LOW_CONFIDENCE_ADDRESS_ERROR_CODES,
  INVALID_PHONE_ERROR_CODES,
} from '@@vap-svc/util/transactions';

function hasError(codes, errors) {
  return errors.some(error => codes.has(error.code));
}

export default function VAPServiceEditModalErrorMessage({
  error: { errors = [] },
  clearErrors,
  title,
}) {
  let content = null;

  switch (true) {
    case hasError(LOW_CONFIDENCE_ADDRESS_ERROR_CODES, errors):
      content = (
        <p>
          We’re sorry. We looked up the address you entered and we're not sure
          mail can be delivered there. Please try entering your address again.
        </p>
      );
      break;

    case hasError(DECEASED_ERROR_CODES, errors):
      content = (
        <div>
          <p>
            We can’t make this update because our records show the Veteran is
            deceased. If this isn’t true, please contact your nearest VA medical
            center.
          </p>
          <a href={facilityLocator.rootUrl}>
            Find your nearest VA medical center
          </a>
        </div>
      );
      break;

    case hasError(INVALID_EMAIL_ADDRESS_ERROR_CODES, errors):
      content = (
        <p>
          It looks like the email you entered isn’t valid. Please enter your
          email address again.
        </p>
      );
      break;

    case hasError(INVALID_PHONE_ERROR_CODES, errors):
      content = (
        <p>
          We can’t make this update because we currently only support U.S. area
          codes. Please provide a U.S.-based phone number.
        </p>
      );
      break;

    default:
      content = (
        <p>
          We’re sorry. We can’t save your {title.toLowerCase()} at this time.
          We’re working to fix this problem. Please try again or check back
          soon.
        </p>
      );
  }

  return (
    <AlertBox
      className="vads-u-margin-top--0"
      content={<div className="columns">{content}</div>}
      isVisible
      onCloseAlert={clearErrors}
      scrollOnShow
      status={ALERT_TYPE.ERROR}
    />
  );
}
