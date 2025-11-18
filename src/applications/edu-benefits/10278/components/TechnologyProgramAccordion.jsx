import React from 'react';

const TechnologyProgramAccordion = () => {
  return (
    <va-accordion open-single>
      <va-accordion-item header="View Privacy Act Statement" id="first">
        <p>
          The VA will not disclose information collected on this form to any
          source other than what has been authorized under the Privacy Act of
          1974 or title 38, Code of Federal Regulations, section 1.576 for
          routine uses (i.e., civil or criminal law enforcement, congressional
          communications, epidemiological or research studies, the collection of
          money owed to the United States, litigation in which the United States
          is a party or has an interest, the administration of VA programs and
          delivery of VA benefits, verification of identity and status, and
          personnel administration) as identified in the VA system of records,
          58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness
          and Employment Records - VA, and published in the Federal Register.
          Your obligation to respond is voluntary. VA uses your SSN to identify
          your claim file. Providing your SSN will help ensure that your records
          are properly associated with your claim file. Giving us your SSN
          account information is voluntary. Refusal to provide your SSN by
          itself will not result in the denial of benefits. The VA will not deny
          an individual benefits for refusing to provide his or her SSN unless
          the disclosure of the SSN is required by Federal Statute of law effect
          prior to January 1, 1975, and still in effect.
        </p>
      </va-accordion-item>
      <va-accordion-item header="View Respondent Burden" id="second">
        <p>
          We need this information to release your private benefit and/or claim
          information to a designated third party(ies). The execution of this
          form does not authorize the release of information other than that
          specifically described. The information requested on this form will
          authorize release of the information you specify. Title 38, United
          States Code, allows us to ask for this information. We estimate that
          you will need an average of 5 minutes to review the instructions, find
          the information, and complete this form. VA cannot conduct or sponsor
          a collection of information unless a valid OMB control number is
          displayed. You are not required to respond to a collection of
          information if this number is not displayed. Valid OMB control numbers
          can be located on the OMB Internet Page at{' '}
          <a
            href="https://www.reginfo.gov/public/do/PRAMain"
            rel="noreferrer"
            target="_blank"
          >
            www.reginfo.gov/public/do/PRAMain
          </a>
          . If desired, you can call 1-800-827-1000 to get information on where
          to send comments or suggestions about this form.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
};

export default TechnologyProgramAccordion;
