import React from 'react';
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
          We're sorry. We can't update your information right now. We're working
          to fix this problem. Please check back later.
        </p>
      );
  }

  return (
    <div
      className="va-profile-alert vads-u-margin-bottom--2 
    vads-u-background-color--secondary-lightest vads-u-display--flex vads-u-padding-y--4 vads-u-padding-right--7 vads-u-padding-left--3 vads-u-width--full"
    >
      <i aria-hidden="true" role="img" />
      <span className="sr-only">Alert: </span>
      <div>{content}</div>
    </div>
  );
}
