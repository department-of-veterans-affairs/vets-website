import React from 'react';
import PropTypes from 'prop-types';

const privacyText = `The VA will not disclose information
      collected on this form to any source other than what has been authorized
      under the Privacy Act of 1974 or Title 38, Code of Federal Regulations
      1.576 for routine uses (i.e., civil or criminal law enforcement,
      congressional communications, epidemiological or research studies, the
      collection of money owed to the United States, litigation in which the
      United States is a party or has an interest, the administration of VA
      programs and delivery of VA benefits, verification of identity and status,
      and personnel administration) as identified in the VA system of records,
      58VA21/22/28 Compensation, Pension, Education, and Veteran Readiness and
      Employment Records - VA, published in the Federal Register. Your
      obligation to respond is voluntary. However, if the information including
      your Social Security Number (SSN) is not furnished completely or
      accurately, the source to which this authorization is addressed may not be
      able to identify and locate your records, and provide a copy to VA. VA
      uses your SSN to identify your claim file. Providing your SSN will help
      ensure that your records are properly associated with your claim file.
      Giving us your SSN account information is voluntary. Refusal to provide
      your SSN by itself will not result in the denial of benefits. The VA will
      not deny an individual benefits for refusing to provide his or her SSN
      unless the disclosure of the SSN is required by Federal Statute of law in
      effect prior to January 1, 1975 and still in effect.`;

const respondentBurden = (
  <p>
    <strong>Respondent Burden:</strong> We need this information and your
    written authorization to obtain your treatment records to help us get the
    information required to process your claim. Title 38, United States Code,
    allows us to ask for this information. You can provide this by signing VA
    Form 21-4142. Federal law permits sources with information about you to
    release that information if you sign a single authorization to release all
    your information from all possible sources. We will make copies of it for
    each source. A few States, and some individual sources of information,
    require that the authorization specifically name the source that you
    authorize to release personal information. In those cases, we may ask you to
    sign one authorization for each source and we may contact you again if we
    need you to sign more authorizations. We estimate that you will need an
    average of 10 minutes to review the instructions, find the information and
    complete this form. VA cannot conduct or sponsor a collection of information
    unless a valid OMB control number is displayed. Valid OMB control numbers
    can be located on the{' '}
    <va-link
      href="https://www.reginfo.gov/public/do/PRAMain"
      external
      text="OMB Internet Page"
    />
    . If desired, you can call <va-telephone contact="8008271000" /> to get
    information on where to send comments or suggestions about this form.
  </p>
);

export const PrivacyActStatementContent = ({ noRespondentBurden = false }) => {
  if (noRespondentBurden) {
    return <p>{privacyText}</p>;
  }

  return (
    <>
      {respondentBurden}
      <p>
        <strong>Privacy Act Notice:</strong> {privacyText}
      </p>
    </>
  );
};

PrivacyActStatementContent.propTypes = {
  noRespondentBurden: PropTypes.bool,
};
