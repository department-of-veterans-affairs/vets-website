import React from 'react';

import PrivacyActStatement from './PrivacyActStatement';

const TechnologyProgramAccordion = () => {
  return (
    <va-accordion open-single>
      <va-accordion-item header="View Privacy Act Statement" id="first">
        <PrivacyActStatement />
      </va-accordion-item>
      <va-accordion-item header="View Respondent Burden" id="second">
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to, a collection of information unless it displays a currently
          valid OMB control number. The OMB control number for this project is
          2900-0892, and it expires 01/31/2028. Public reporting burden for this
          collection of information is estimated to average 15 minutes per
          respondent, per year, including the time for reviewing instructions,
          searching existing data sources, gathering and maintaining the data
          needed, and completing and reviewing the collection of information.
          Send comments regarding this burden estimate and any other aspect of
          this collection of information, including suggestions for reducing the
          burden, to VA Reports Clearance Officer at
          <a
            href="mailto:VACOPaperworkReduAct@va.gov"
            target="_blank"
            rel="noreferrer"
          >
            VACOPaperworkReduAct@va.gov.
          </a>
          Please refer to OMB Control No. 2900-0892 in any correspondence. Do
          not send your completed VA Form 22-10272 to this email address.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
};

export default TechnologyProgramAccordion;
