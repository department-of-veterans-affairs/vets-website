import PropTypes from 'prop-types';
import React from 'react';

export const ConfirmationPagePropTypes = {
  form: PropTypes.shape({
    pages: PropTypes.object,
    data: PropTypes.shape({
      applicants: PropTypes.array,
      statementOfTruthSignature: PropTypes.string,
      veteransFullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({ confirmationNumber: PropTypes.string }),
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export const ADDITIONAL_FILES_HINT =
  'Depending on your response, you may need to submit additional documents with this application.';

// TODO: Audit 10-10d and 10-7959a to make sure they're referencing
// this address here so we can control from one place.
export const CHAMPVA_ADDRESS = (
  <>
    <address className="va-address-block">
      VHA Office of Integrated Veteran Care
      <br />
      ATTN: CHAMPVA Claims
      <br />
      PO Box 500
      <br />
      Spring City, PA 19475
      <br />
    </address>
  </>
);

// TODO: Audit all IVC forms and make sure they're referencing
// these values so we can control them all in one place.
export const CHAMPVA_PHONE_NUMBER = '8007338387';
export const CHAMPVA_FAX_NUMBER = '3033317809';
export const CHAMPVA_CLAIMS_PHONE_NUMBER = CHAMPVA_PHONE_NUMBER;
export const CHAMPVA_CLAIMS_FAX_NUMBER = '3033317804';
export const CHAMPVA_OHI_PHONE_NUMBER = CHAMPVA_PHONE_NUMBER;
export const CHAMPVA_OHI_FAX_NUMBER = '3033317808';
export const FMP_PHONE_NUMBER = '3033317590';
export const FMP_FAX_NUMBER = '3033317803';
