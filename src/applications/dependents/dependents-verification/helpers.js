import React from 'react';

export const hasSession = () => {
  return localStorage.getItem('hasSession') === 'true';
};

export const PRIVACY_ACT_NOTICE = (
  <>
    <p>
      <strong>PRIVACY ACT NOTICE:</strong> The VA will not disclose information
      collected on this form to any source other than what has been authorized
      under the Privacy Act of 1974 or Title 5, Code of Federal Regulations
      1.526 for routine uses (i.e., civil or criminal law enforcement,
      congressional communications, epidemiological or research studies, the
      collection of money owed to the United States, litigation in which the
      United States is a party or has an interest, the administration of VA
      programs and delivery of VA benefits, verification of identity and status,
      and personnel administration) as identified in the VA system of records,
      58VA21/22/28 Compensation, Pension, Education, Veteran Readiness and
      Employment Records - VA, published in the Federal Register. <br />
      Your obligation to respond is required to obtain or retain benefits. You
      must give us your and your dependents SSN account information. Applicants
      are required to provide their SSN and the SSN of any dependents for whom
      benefits are claimed under Title 38 U.S.C. 5101 (c) (1). The VA will not
      deny an individual benefits for refusing to provide his or her SSN unless
      the disclosure of the SSN is required by Federal Statute of law in effect
      prior to January 1, 1975, and still in effect. Information that you
      furnish may be utilized in computer matching programs with other Federal
      or state agencies for the purpose of determining your eligibility to
      receive VA benefits, as well as to collect any amount owed to the United
      States by virtue of your participation in any benefit program administered
      by the Department of Veterans Affairs.
    </p>
    <p>
      <strong>RESPONDENT BURDEN:</strong> We need this information to determine
      continued eligibility for an additional allowance for your spouse and/or
      child(ren). <br /> 38 U.S.C. 1115, Title 38, United States Code, allows us
      to ask for this information. We estimate that you will need an average of
      10 minutes to review the instructions, find the information and complete
      this form. <br /> VA cannot conduct or sponsor a collection of information
      unless a valid OMB control number is displayed. Valid OMB control numbers
      can be located on the OMB Internet page at{' '}
      <va-link
        text="www.reginfo.gov/public/do/PRAMain"
        href="www.reginfo.gov/public/do/PRAMain"
      />
      <br />
      If desired, you may call 1-800-827-1000 to get information on where to
      send comments or suggestions about this form.
    </p>
  </>
);
