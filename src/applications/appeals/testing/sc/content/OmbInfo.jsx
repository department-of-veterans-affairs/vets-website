import React from 'react';

import {
  titleFormDetails,
  subTitle995,
  title4142Omb,
  subTitle4142Omb,
} from './title';

const OmbInfo = () => (
  <>
    <p>{subTitle995}</p>
    <va-omb-info res-burden="15" omb-number="2900-0886" exp-date="4/30/2024">
      <p>
        <strong>Respondent Burden:</strong> We need this information to
        determine entitlement to benefits (38 U.S.C. 501). Title 38, United
        States Code, allows us to ask for this information. We estimate that you
        will need an average of 15 minutes to review the instructions, find the
        information, and complete the form. VA cannot conduct or sponsor a
        collection of information unless a valid OMB control number is
        displayed. You are not required to respond to a collection of
        information if this number is not displayed. Valid OMB control numbers
        can be located on the{' '}
        <a
          href="https://www.reginfo.gov/public/do/PRAMain"
          target="_blank"
          rel="noreferrer"
        >
          OMB Internet Page (opens in a new tab)
        </a>
        . If desired, you can call <va-telephone contact="8008271000" /> to get
        information on where to send comments or suggestions about this form.
      </p>
      <p>
        <strong>Privacy Act Notice:</strong> VA will not disclose information
        collected on this form to any source other than what has been authorized
        under the Privacy Act of 1974 or title 38, Code of Federal Regulations,
        section 1.576 for routine uses (i.e., civil or criminal law enforcement,
        congressional communications, epidemiological or research studies, the
        collection of money owed to the United States, litigation in which the
        United States is a party or has an interest, the administration of VA
        programs and delivery of VA benefits, verification of identity and
        status, and personnel administration) as identified in the following VA
        systems of records published in the Federal Register, 58/VA21/22/28,
        Compensation, Pension, Education and Veterans Readiness and Employment
        Records -VA; 55VA26 Loan Guaranty Home, Condominium and Manufactured
        Home Loan Applicant Records, Specially Adapted Housing Applicant
        Records, and Vendee Loan Applicant Records -VA; and 36VA29, Veterans and
        Armed Forces Personnel Programs of Government Life Insurance -VA. Your
        obligation to respond is required to obtain or retain benefits. VA uses
        your SSN to identify your claims file. Providing your SSN will help
        ensure that your records are properly associated with your claim file.
        Giving us your SSN account information is voluntary. Refusal to provide
        your SSN by itself will not result in the denial of benefits. VA will
        not deny an individual benefits for refusing to provide his or her SSN
        unless the disclosure of the SSN is required by a Federal Statute of law
        in effect prior to January 1, 1975, and still in effect. The requested
        information is considered relevant and necessary to determine maximum
        benefits under the law. The responses you submit are considered
        confidential (38 U.S.C. 5701). Information submitted is subject to
        verification through computer matching programs with other agencies.
      </p>
    </va-omb-info>

    <h2 className="vads-u-margin-y--2">{titleFormDetails}</h2>
    <h3>{title4142Omb}</h3>
    <p>{subTitle4142Omb}</p>
    <va-omb-info res-burden="10" omb-number="2900-0858" exp-date="7/31/2024">
      <p>
        <strong>Respondent Burden:</strong> We need this information and your
        written authorization to obtain your treatment records to help us get
        the information required to process your claim. Title 38, United States
        Code, allows us to ask for this information. You can provide this by
        signing VA Form 21-4142. Federal law permits sources with information
        about you to release that information if you sign a single authorization
        to release all your information from all possible sources. We will make
        copies of it for each source. A few States, and some individual sources
        of information, require that the authorization specifically name the
        source that you authorize to release personal information. In those
        cases, we may ask you to sign one authorization for each source and we
        may contact you again if we need you to sign more authorizations. We
        estimate that you will need an average of 10 minutes to review the
        instructions, find the information and complete this form. VA cannot
        conduct or sponsor a collection of information unless a valid OMB
        control number is displayed. Valid OMB control numbers can be located on
        the{' '}
        <a
          href="https://www.reginfo.gov/public/do/PRAMain"
          target="_blank"
          rel="noreferrer"
        >
          OMB Internet Page (opens in a new tab)
        </a>
        . If desired, you can call <va-telephone contact="8008271000" /> to get
        information on where to send comments or suggestions about this form.
      </p>
      <p>
        <strong>Privacy Act Notice:</strong> The VA will not disclose
        information collected on this form to any source other than what has
        been authorized under the Privacy Act of 1974 or Title 38, Code of
        Federal Regulations 1.576 for routine uses (i.e., civil or criminal law
        enforcement, congressional communications, epidemiological or research
        studies, the collection of money owed to the United States, litigation
        in which the United States is a party or has an interest, the
        administration of VA programs and delivery of VA benefits, verification
        of identity and status, and personnel administration) as identified in
        the VA system of records, 58VA21/22/28 Compensation, Pension, Education,
        and Veteran Readiness and Employment Records - VA, published in the
        Federal Register. Your obligation to respond is voluntary. However, if
        the information including your Social Security Number (SSN) is not
        furnished completely or accurately, the source to which this
        authorization is addressed may not be able to identify and locate your
        records, and provide a copy to VA. VA uses your SSN to identify your
        claim file. Providing your SSN will help ensure that your records are
        properly associated with your claim file. Giving us your SSN account
        information is voluntary. Refusal to provide your SSN by itself will not
        result in the denial of benefits. The VA will not deny an individual
        benefits for refusing to provide his or her SSN unless the disclosure of
        the SSN is required by Federal Statute of law in effect prior to January
        1, 1975 and still in effect.
      </p>
    </va-omb-info>

    <h3>If you experienced military sexual trauma (MST)</h3>
    <p>
      We provide free treatment for any physical or mental health conditions
      related to your experiences of MST. You don’t need to have reported the
      MST at the time or have other proof that the MST occurred to get care.
    </p>
    <p className="vads-u-margin-bottom--4">
      <a
        href="/health-care/health-needs-conditions/military-sexual-trauma/"
        target="_blank"
      >
        Learn more about MST-related services (opens in new tab)
      </a>
    </p>
  </>
);

export default OmbInfo;
