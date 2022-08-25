import React from 'react';
import PropTypes from 'prop-types';
import { getAppUrl } from 'platform/utilities/registry-helpers';

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
        <p className="vads-u-margin-y--0">
          We’re sorry. We looked up the address you entered and we're not sure
          mail can be delivered there. Please try entering your address again.
        </p>
      );
      break;

    case hasError(DECEASED_ERROR_CODES, errors):
      content = (
        <div className="vads-u-margin-y--0">
          <p>
            We can’t make this update because our records show the Veteran is
            deceased. If this isn’t true, please contact your nearest VA medical
            center.
          </p>
          <a href={getAppUrl('facilities')}>
            Find your nearest VA medical center
          </a>
        </div>
      );
      break;

    case hasError(INVALID_EMAIL_ADDRESS_ERROR_CODES, errors):
      content = (
        <p className="vads-u-margin-y--0">
          It looks like the email you entered isn’t valid. Please enter your
          email address again.
        </p>
      );
      break;

    case hasError(INVALID_PHONE_ERROR_CODES, errors):
      content = (
        <p className="vads-u-margin-y--0">
          We can’t make this update because we currently only support U.S. area
          codes. Please provide a U.S.-based phone number.
        </p>
      );
      break;

    default:
      content = (
        <p id="error-message-details" className="vads-u-margin-y--0">
          We’re sorry. We can’t update your information right now. We’re working
          to fix this problem. Please check back later.
        </p>
      );
  }

  return (
    <>
      <va-alert background-only status="error" show-icon visible>
        <div className="vads-u-display--flex vads-u-align-items--baseline">
          <span className="sr-only">Alert: </span>
          <div role="alert">{content}</div>
        </div>
      </va-alert>
    </>
  );
}

VAPServiceEditModalErrorMessage.propTypes = {
  error: PropTypes.shape({
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        message: PropTypes.string,
      }),
    ),
  }),
};
