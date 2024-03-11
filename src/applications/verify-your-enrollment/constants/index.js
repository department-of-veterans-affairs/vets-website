import React from 'react';
import PropTypes from 'prop-types';
import manifest from '../manifest.json';

export const BASE_URL = `${manifest.rootUrl}/`;
export const BENEFITS_PROFILE_URL_SEGMENT = 'benefits-profile';
export const VERIFICATION_PROFILE_URL = BASE_URL;
export const VERIFICATION_RELATIVE_URL = `/`;

export const BENEFITS_PROFILE_URL = `${VERIFICATION_PROFILE_URL}${BENEFITS_PROFILE_URL_SEGMENT}/`;
export const BENEFITS_PROFILE_RELATIVE_URL = `${VERIFICATION_RELATIVE_URL}${BENEFITS_PROFILE_URL_SEGMENT}/`;

export const CHANGE_OF_DIRECT_DEPOSIT_TITLE = 'Direct deposit information';
export const DIRECT_DEPOSIT_BUTTON_TEXT = 'Add or update account';
export const CHANGE_OF_ADDRESS_TITLE = 'Contact information';
export const PAYEE_INFO_TITLE = 'Payee information';
export const PENDING_DOCUMENTS_TITLE = 'Pending documents';
export const ADDRESS_BUTTON_TEXT = 'Edit';
export const SMALL_SCREEN = 481;
export const ENROLLMETS_PER_PAGE = 6;
export const howToChangeLegalNameInfoLink =
  'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/';

// add field title to make it a required field for the change of address form
export const addressFormRequiredData = [
  'countryCodeIso3',
  'addressLine1',
  'city',
  'stateCode',
  'zipCode',
];

// Regex that uses a negative lookahead to check that a string does NOT contain
// things like `http`, `www.`, or a few common TLDs.
export const blockURLsRegEx =
  '^((?!http|www\\.|\\.co|\\.net|\\.gov|\\.edu|\\.org).)*$';

// export const STREET_LINE_MAX_LENGTH = 20;
export const Paragraph = ({ title, date, className }) => {
  return (
    <p
      className={`vads-u-font-size--md vads-u-font-family--serif vads-u-font-weight--bold ${className}`}
    >
      {title}:
      <span className="vads-u-font-weight--normal vads-u-font-family--sans text-color vads-u-display--inline-block vads-u-margin-left--1">
        {date}
      </span>
    </p>
  );
};
Paragraph.propTypes = {
  className: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
};

export const ACTIVEDUTYBENEFITSSTATEMENT = (
  <p>
    Your benefits are not yet set to expire because you are still on active
    duty. Benefits end 10 years from the date of your last discharge or release
    from active duty.
  </p>
);

export const PENDING_DOCUMENTS_STATEMENT = (
  <p>The following document is currently being processed for your account.</p>
);

// export const PENDING_DOCUMENTS_STATEMENT_ALT = (
//   <p>
//     The following information was taken from your electronic Education file.
//     Due to system limitations, only one document is displayed. If you or your school submitted multiple documents
//     we are processing all of them. Documents will be processed in the order
//     received.
//   </p>
// )

export const NO_PENDING_DOCUMENTS_STATMENT = (
  <p>
    We currently do not show a claim pending. If you recently submitted your
    claim, Verify Your Enrollment may not have been updated yet. Please allow
    for mail time plus 3 - 5 business days. Check back periodically. If you have
    had a claim pending, but it is no longer reflected on this page, it may have
    been recently completed.
  </p>
);

export const TIMS_DOCUMENTS = {
  '1990': {
    displayName: 'Application for Benefits (VA Form 22-1990)',
    explanation: 'Application for Education Benefits',
  },
  VE1990: {
    displayName: 'Application for Benefits (VA Form 22-1990)',
    explanation: 'Application for Education Benefits',
  },
  '1990EG': {
    displayName: 'Application for Benefits (VA Form 22-1990)',
    explanation: 'Application for Education Benefits',
  },
  BPI: {
    displayName: 'Benefit Payment Inquiry',
    explanation: 'An inquiry regarding your benefit payments',
  },
  CERTS: {
    displayName: 'Monthly Verification of Attendance',
    explanation:
      'A document to verify your attendance or a change submitted via WAVE to report a change in hours or a termination.',
  },
  '1995': {
    displayName: 'Change of School or Program (VA Form 22-1995)',
    explanation:
      'Document received indicating you have changed your program or training establishment.',
  },
  '1999': {
    displayName: 'Enrollment Certification (VA Form 22-1999)',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment.',
  },
  AM1999: {
    displayName: 'Enrollment Certification (VA Form 22-1999)',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment.',
  },
  '1999B': {
    displayName: 'Notice of Change in Status (VA Form 22-1999b)',
    explanation:
      'A change in your hours or a termination of enrollment provided by your training establishment.',
  },
  '686C': {
    displayName: 'Declaration of Dependents (VA Form 21-686c)',
    explanation: 'Form used to add dependents to an award.',
  },
  APPLS: {
    displayName: 'Appeals',
    explanation: 'A document appealing a decision.',
  },
  CORRA: {
    displayName: 'Correspondence',
    explanation:
      'Mail received from you, your school, DoD, or other entity that does not fit into other listed categories.',
  },
  CORRF: {
    displayName: 'Correspondence',
    explanation:
      'Mail received from you, your school, DoD, or other entity that does not fit into other listed categories.',
  },
  CORRV: {
    displayName: 'Correspondence',
    explanation:
      'Mail received from you, your school, DoD, or other entity that does not fit into other listed categories.',
  },
  DD214: {
    displayName: 'DD-214',
    explanation:
      'A copy of your Department of Defense form issued at the time of your discharge from active duty.',
  },
  POA: {
    displayName: 'Power of Attorney',
    explanation: 'A designation form for appointing a power of attorney.',
  },
  E1999: {
    displayName: 'Enrollment Certification',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment.',
  },
  E1999B: {
    displayName: 'Electronic Cert Change',
    explanation:
      'A change in your hours or a termination of enrollment provided by your training establishment.',
  },
  AP1999: {
    displayName: 'Advance Pay Enrollment Certification',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment which requests an advance payment of benefits.',
  },
  HC1999: {
    displayName: 'Enrollment Certification',
    explanation:
      'Enrollment dates, hours, program, etc. received from a training establishment offering flight, correspondence, apprenticeship, or OJT programs.',
  },
  '5490': {
    displayName:
      "Electronic Application For Dependent's Education Benefits (VA Form 22-5490)",
    explanation:
      'Application for Education Benefits for dependents based on the veteran being 100% permanently and totally disabled submitted via the Internet using VONAPP.',
  },
  TUTOR: {
    displayName: 'Tutorial Assistance Request',
    explanation: 'A request for reimbursement of tutor fees.',
  },
  NOBE: {
    displayName: 'Notice of Basic Eligibility',
    explanation:
      'A Department of Defense form establishing eligibility to Montgomery GI Bill® - Selective Reserve (Chapter 1606).',
  },
  G1999: {
    displayName: 'Enrollment Certification',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment.',
  },
  G1999B: {
    displayName: 'Notice of Change in Status',
    explanation:
      'A change of hours or a termination of enrollment provided by your training establishment.',
  },
  LAC: {
    displayName: 'Licensing and Certification Tests',
    explanation:
      'Request for reimbursement of Licensing and/or Certification testing fees.',
  },
  TATU: {
    displayName: 'Tuition Assistance Top-Up',
    explanation: 'Request for Tuition Assistance Top-Up reimbursement.',
  },
  V1990: {
    displayName: 'Electronic Application for Benefits',
    explanation:
      'Application for Education Benefits submitted via the Internet using VONAPP.',
  },
  OTAT: {
    displayName: 'Tuition Assistance Top-Up',
    explanation: 'Request for Tuition Assistance Top-Up reimbursement.',
  },
  ACCEL: {
    displayName: 'Accelerated Pay Enrollment Certification',
    explanation:
      'Enrollment dates, hours, program, etc. received from your training establishment which requests accelerated pay for high tech, high cost courses.',
  },
  V1995: {
    displayName: 'V1995',
    explanation:
      'Document submitted via the Internet using VONAPP indicating you have changed your program or training establishment.',
  },
  V5490: {
    displayName: "Electronic Application For Dependent's Education Benefits",
    explanation:
      'Application for Education Benefits for dependents based on the veteran being 100% permanently and totally disabled submitted via the Internet using VONAPP.',
  },
  V5495: {
    displayName: 'Electronic Change of School or Program',
    explanation:
      'Document submitted via the Internet using VONAPP indicating that you have changed your program or training establishment.',
  },
  VSIGN: {
    displayName: 'VONAPP Signature',
    explanation:
      'Your signature supporting a document you submitted using VONAPP.',
  },
  O1990: {
    displayName: 'Application for Benefits',
    explanation: 'Application for Education benefits.',
  },
  OV1990: {
    displayName: 'Electronic Application for Benefits',
    explanation:
      'Application for Education Benefits, submitted via the Internet using VONAPP.',
  },
  O5490: {
    displayName: "Application for Dependent's Education benefits",
    explanation:
      'Application for Education Benefits based on the veteran being 100% permanently and totally disabled.',
  },
  OV5490: {
    displayName: "Electronic Application For Dependent's Education Benefits",
    explanation:
      'Application for Education Benefits for dependents based on the veteran being 100% permanently and totally disabled submitted via the Internet using VONAPP.',
  },
  OHCOPY: {
    displayName: 'Flight, Apprenticeship, OJT, or Correspondence Claim',
    explanation:
      'A document received from a training establishment offering flight, correspondence, apprenticeship, or OJT programs.',
  },
};
