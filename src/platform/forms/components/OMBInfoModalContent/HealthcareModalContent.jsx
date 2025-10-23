import React from 'react';

export default function HealthcareModalContent({ resBurden, ombNumber }) {
  return (
    <>
      <h3>Paperwork Reduction Act and Privacy Act information</h3>
      <p>
        The Privacy Act of 1974, the Paperwork Reduction Act of 1980, and the
        Paperwork Reduction act of 1995 require that when we ask you for
        information we must first tell you our legal right to ask for the
        information, why we are asking for it, and how it will be used. We must
        also tell you whether your response is voluntary, required to obtain a
        benefit, or mandatory under the law and what could happen if we don’t
        receive the information.
      </p>

      <h4>VA’s legal right to ask for the information (authority)</h4>

      <p>
        We are asking you to provide the information on this form under 38 USC
        Sections 1705, 1710, 1712, and 1722. We need this information to
        determine your eligibility for healthcare benefits.
      </p>

      <h4>Why VA is asking for it (purpose)</h4>

      <p>
        We use the requested information to determine your eligibility for
        healthcare benefits.
      </p>

      <h4>How your information will be used (routine use)</h4>

      <p>
        Information you supply may be subject to verification through computer
        matching programs with other agencies. We will not disclose any
        information collected on this form to any source other than what is
        permitted by law. VA may make a "routine use" disclosure of the
        information as outlined in individual{' '}
        <a href="https://www.oprm.va.gov/privacy/systems_of_records.aspx">
          Systems of Records Notices
        </a>{' '}
        and in accordance with{' '}
        <a href="/privacy-policy/">VA privacy practices</a>.{' '}
      </p>
      <p>
        If you provide VA your Social Security Number, VA will use it to
        administer your VA benefits. VA may also use this information to
        identify Veterans and persons claiming or receiving VA benefits and
        their records, and for other purposes authorized or required by law.
      </p>

      <h4>
        Your obligation to provide the information and what happens if we don’t
        receive it (disclosure)
      </h4>

      <p>
        Providing the requested information is voluntary, but if any or all of
        the requested information is not provided, it may delay or result in
        denial of your request for healthcare benefits. Failure to furnish the
        information will not have any effect on any other benefits to which you
        may be entitled.
      </p>
      <p>
        Giving us your SSN information is voluntary. Refusal to provide your SSN
        by itself will not result in the denial of benefits. The VA will not
        deny anyone benefits for refusing to provide their SSN unless the
        disclosure of the SSN is required by a Federal Statute of law enacted
        before January 1, 1975, and still in effect.
      </p>

      <h4>Paperwork Reduction Act</h4>
      <p>
        We can’t conduct or sponsor a collection of information that is subject
        to the Paperwork Reduction Act unless a{' '}
        <a href="www.reginfo.gov/public/do/PRAMain">valid OMB control number</a>{' '}
        is displayed. You are not required to respond to a collection of
        information if this number is not displayed. This form’s OMB control
        number is: {ombNumber}
      </p>

      <h4>Estimated Burden</h4>
      <p>
        We estimate that you will need an average of {resBurden} minutes to
        complete this form. This includes the time it will take to read the
        instructions, find the requested information, and fill out the form.
      </p>
    </>
  );
}
