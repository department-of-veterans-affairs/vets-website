import React from 'react';

export default function PrivacyAccoridion() {
  return (
    <va-accordion open-single>
      <va-accordion-item
        bordered
        header="View Privacy Act Statement"
        data-testid="privacy-act"
      >
        <p>
          VA will not disclose information collected on this form to any source
          other than what has been authorized under the Privacy Act of 1974 or
          Title 38, Code of Federal Regulations 1.576 for routine uses as
          identified in the VA system of records, 58VA21/22/28, Compensation,
          Pension, Education, and Veteran Readiness and Employment Records - VA,
          published in the Federal Register. An example of a routine use (e.g.,
          VA sends educational forms or letters with a veteran's identifying
          information to the veteran's school or training establishment to (1)
          assist the veteran in the completion of claims forms or (2) for VA to
          obtain further information as may be necessary from the school for VA
          to properly process the veteran's education claim or to monitor his or
          her progress during training). Your obligation to respond is required
          to obtain or retain education benefits. VA cannot recognize you as the
          proper certifying official unless the information is furnished as
          required by existing law (38 U.S.C. 3680(g)). The responses you submit
          are considered confidential (38 U.S.C. 5701). Any information provided
          by applicants, recipients, and others is subject to verification
          through computer matching programs with other agencies.
        </p>
      </va-accordion-item>
      <va-accordion-item
        bordered
        header="View Respondent Burden"
        data-testid="respondent-burden"
      >
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to, a collection of information unless it displays a currently
          valid OMB control number. The OMB control number for this project is
          2900-0853, and it expires 8/31/2025. Public reporting burden for this
          collection of information is estimated to average 20 minutes per
          respondent, per year, including the time for reviewing instructions,
          searching existing data sources, gathering and maintaining the data
          needed, and completing and reviewing the collection of information.
          Send comments regarding this burden estimate and any other aspect of
          this collection of information, including suggestions for reducing the
          burden, to VA Reports Clearance Officer at{' '}
          <a href="mailto:VACOPaperworkReduAct@va.gov" rel="noreferrer">
            VACOPaperworkReduAct@va.gov
          </a>
          . Please refer to OMB Control No. 2900-0853 in any correspondence. Do
          not send your completed VA Form 22-0976 to this email address.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}
