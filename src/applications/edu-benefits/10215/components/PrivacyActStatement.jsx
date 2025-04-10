import React from 'react';
import PropTypes from 'prop-types';

const PrivacyActStatement = ({ ombNumber = '2900-0897' }) => {
  return (
    <>
      <p data-testid="respondent-burden">
        <strong>Respondent Burden:</strong> An agency may not conduct or
        sponsor, and a person is not required to respond to, a collection of
        information unless it displays a currently valid OMB control number. The
        OMB control number for this project is {ombNumber}, and it expires
        01/31/2028. Public reporting burden for this collection of information
        is estimated to average 1 hour per respondent, per year, including the
        time for reviewing instructions, searching existing data sources,
        gathering and maintaining the data needed, and completing and reviewing
        the collection of information. Send comments regarding this burden
        estimate and any other aspect of this collection of information,
        including suggestions for reducing the burden, to VA Reports Clearance
        Officer at{' '}
        <a
          href="mailto:VACOPaperworkReduAct@va.gov"
          target="_blank"
          rel="noreferrer"
        >
          VACOPaperworkReduAct@va.gov
        </a>
        . Please refer to OMB Control No. {ombNumber} in any correspondence. Do
        not send your completed VA Form 22-10215 to this email address.
      </p>

      <p data-testid="privacy-act-notice">
        <strong>Privacy Act Notice:</strong> VA will not disclose information
        collected on this form to any source other than what has been authorized
        under the Privacy Act of 1974 or Title 38, Code of Federal Regulations
        1.576 for routine uses as identified in the VA system of records,
        58VA21/22/28, Compensation, Pension, Education, Veteran Readiness and
        Employment Records - VA, published in the Federal Register. An example
        of a routine use (e.g., VA sends educational forms or letters with a
        Veteran’s identifying information to the Veteran’s school or training
        establishment to (1) assist the Veteran in the completion of claims
        forms or (2) for VA to obtain further information as may be necessary
        from the school for VA to properly process the Veteran’s education claim
        or to monitor his or her progress during training). Your obligation to
        respond is required to obtain or retain education benefits. The
        responses you provide are considered confidential (38 U.S.C. 5701). Any
        information provided by applicants, recipients, and others is subject to
        verification through computer matching programs with other agencies.
      </p>
    </>
  );
};

PrivacyActStatement.propTypes = {
  ombNumber: PropTypes.string,
};

export default PrivacyActStatement;
