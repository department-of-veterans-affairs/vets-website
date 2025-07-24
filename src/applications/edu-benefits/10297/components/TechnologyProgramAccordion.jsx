import React from 'react';

export default function TechnologyProgramAccordion() {
  return (
    <va-accordion open-single>
      <va-accordion-item header="View Privacy Act Statement" id="first">
        <p>
          The VA will not disclose information collected on this form to any
          source other than what has been authorized under the Privacy Act of
          1974 or title 38, Code of Federal Regulations, section 1.576 for
          routine uses (e.g., VA sends educational forms or letters with a
          veteran’s identifying information to the veteran’s school or training
          establishment to (1) assist the veteran in the completion of claims
          forms or (2) for the VA to obtain further information as may be
          necessary from the school for the VA to properly process the veteran’s
          education claim or to monitor his or her progress during training) as
          identified in the VA system of records, 58VA21/22/28, Compensation,
          Pension, Education, and Veteran Readiness and Employment Records - VA,
          and published in the Federal Register. Your response is required to
          obtain or retain education benefits. Giving us your SSN account
          information is voluntary. Refusal to provide your SSN by itself will
          not result in the denial of benefits. The VA will not deny an
          individual benefits for refusing to provide his or her SSN unless the
          disclosure of the SSN is required by a Federal Statute of law enacted
          before January 1, 1975, and still in effect. The requested information
          is considered relevant and necessary to determine the maximum benefits
          under the law. While you do not have to respond, VA cannot process
          your claim for education assistance unless the information is
          furnished as required by existing law (38 U.S.C. 3471). The responses
          you submit are considered confidential (38 U.S.C. 5701). Any
          information provided by applicants, recipients, and others may be
          subject to verification through computer matching programs with other
          agencies.
        </p>
      </va-accordion-item>
      <va-accordion-item header="View Respondent Burden" id="second">
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to, a collection of information unless it displays a currently
          valid OMB control number. The OMB control number for this project is
          2900-XXXX, and it expires XX/XX/20XX. Public reporting burden for this
          collection of information is estimated to average 10 minutes per
          respondent, per year, including the time for reviewing instructions,
          searching existing data sources, gathering and maintaining the data
          needed, and completing and reviewing the collection of information.
          Send comments regarding this burden estimate and any other aspect of
          this collection of information, including suggestions for reducing the
          burden, to VA Reports Clearance Officer at{' '}
          <a href="mailto:VACOPaperworkReduAct@va.gov" rel="noreferrer">
            VACOPaperworkReduAct@va.gov
          </a>
          . Please refer to OMB Control No. 2900-XXXX in any correspondence. Do
          not send your completed VA Form 22-10297 to this email address.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}
