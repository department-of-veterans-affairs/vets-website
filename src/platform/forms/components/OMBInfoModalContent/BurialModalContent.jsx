import React from 'react';

export default function HealthcareModalContent({ resBurden, ombNumber }) {
  return (
    <>
      <h3>Privacy Act Statement</h3>
      <p>
        <strong>Respondent Burden:</strong> This information is collected in
        accordance with section 3507 of the Paperwork Reduction Act of 1995.
        Accordingly, we may not conduct or sponsor, and you are not required to
        respond to a collection of information unless it displays a valid OMB
        number. We anticipate the time expended by individuals who complete this
        form will average 20 minutes per response, including the time to review
        instructions, search existing data sources, gather the necessary data,
        and complete and review the collection of information. Your response is
        voluntary and not required to obtain or retain benefits to which you may
        be entitled. Send comments concerning the accuracy of this burden
        estimate, including suggestions for reducing this burden or any other
        aspect of this collection of information to the VA Clearance Officer
        (005R1B), 810 Vermont Avenue, NW, Washington, DC 20420. Please DO NOT
        send claims for, or correspondence regarding benefits to this address.
        <br />
        <br />
        <strong>Privacy Act Notice:</strong> Title 38 U.S.C. 2402 authorizes the
        solicitation of this information. VA considers the responses you submit
        confidential (38 U.S.C. 5701). VA may only disclose this information
        outside the VA if the disclosure is authorized under the Privacy Act,
        including the routine uses identified in the VA system of records,
        175VA41A, published in the Federal Register. VA considers the requested
        information relevant and necessary to determine maximum benefits under
        the law. The purpose for which the records are used will include, but
        will not be limited to the provision of VA burial and memorial benefits;
        provision of information about VA burial and memorial benefits,
        including specific claims; determination of eligibility for burial in a
        VA national cemetery; disclosure of military service information upon
        request from VA funded State and Tribal Veterans cemeteries;
        coordination of committal services and interment upon request of
        families, funeral homes, and others of eligible decedents at VA national
        cemeteries.
      </p>

      <h4>VA’s legal right to ask for the information (authority)</h4>

      <p>
        We are asking you to provide the information on this form under 38 USC
        Ch. 23. We need this information to determine your eligibility for
        burial benefits.
      </p>

      <h4>Why VA is asking for it (purpose)</h4>

      <p>
        We use the requested information to determine your eligibility for
        burial benefits.
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
        denial of your request for burial benefits. Failure to furnish the
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
