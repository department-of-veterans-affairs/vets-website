import React from 'react';

export default function TechnologyProgramAccordion() {
  return (
    <va-accordion open-single>
      <va-accordion-item header="View Privacy Act Statement" id="first">
        <p>
          VA will not disclose information collected on this form to any sources
          other than what has been authorized under the Privacy Act of 1974 or
          Title 38, Code of Federal Regulations, Section 1.526 for routine uses
          (e.g. VA sends education forms or letters with a veteran's identifying
          information to the veteran's school or training establishment) to (1)
          assist the veteran in the completion of claims forms or (2) for the VA
          to obtain further information as may be necessary from the school for
          the VA to properly process the veteran's education claim or to monitor
          his or her progress during training as identified in the VA System of
          Records, 58VA21/22/28, Compensation, Pension, Education and Veteran
          Readiness and Employment Records - VA, published in the Federal
          Register.
        </p>
      </va-accordion-item>
      <va-accordion-item header="View Respondent Burden" id="second">
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to, a collection of information unless it displays a currently
          valid OMB control number. The OMB control number for this project is
          2900-0718, and it expires 01/31/2028. Public reporting burden for this
          collection of information is estimated to average 15 minutes per
          respondent, per year, including the time for reviewing instructions,
          searching existing data sources, gathering and maintaining the data
          needed, and completing and reviewing the collection of information.
          Send comments regarding this burden estimate and any other aspect of
          this collection of information, including suggestions for reducing the
          burden, to VA Reports Clearance Officer at{' '}
          <a href="mailto:VACOPaperworkReduAct@va.gov" rel="noreferrer">
            VACOPaperworkReduAct@va.gov
          </a>
          . Please refer to OMB Control No. 2900-0718 in any correspondence. Do
          not send your completed VA Form 22-10275 to this email address.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}
