import React from 'react';

export default function PrivacyAccordion() {
  return (
    <va-accordion open-single>
      <va-accordion-item
        header="View Privacy Act Statement"
        data-testid="privacy-act"
      >
        <p>
          VA will not disclose information collected on this form to any source
          other than what has been authorized under the Privacy Act of 1974 or
          title 38, Code of Federal Regulations 1.576 for routine uses (i.e., VA
          sends educational forms or letters with a veteran’s identifying
          information to the veteran’s school or training establishment to (1)
          assist the veteran in the completion of claims forms or (2) VA obtains
          further information as may be necessary from the school for VA to
          properly process the veteran’s education claim or to monitor his or
          her progress during training) as identified in the VA system or
          records, 58VA21/22/28, Compensation, Pension, Education, and Veteran
          Readiness and Employment Records - VA, published in the Federal
          Register. Your obligation to respond is required to obtain or retain
          benefits (licensing and certification test reimbursement). While you
          do not have to respond, VA cannot reimburse you any licensing and
          certification test fees until we receive this information (38 U.S.C.
          3452(b) and 3501 (a)). Your responses are confidential (38 U.S.C.
          5701). Information submitted is subject to verification through
          computer matching programs with other agencies.
        </p>
      </va-accordion-item>
      <va-accordion-item
        header="View Respondent Burden"
        data-testid="respondent-burden"
      >
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to, a collection of information unless it displays a currently
          valid OMB control number. The OMB control number for this project is
          2900-0695, and it expires 01/31/2028. Public reporting burden for this
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
          . Please refer to OMB Control No. 2900-0695 in any correspondence. Do
          not send your completed VA Form 22-0803 to this email address.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}
