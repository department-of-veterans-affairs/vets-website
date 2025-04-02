import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const OmbInfo = () => {
  const resBurden = 10;

  return (
    <va-omb-info
      res-burden={resBurden}
      omb-number="2900-0922"
      exp-date="9/30/2026"
    >
      <p>
        <strong>Respondent Burden:</strong> We need this information to
        determine your eligibility for benefits (38 U.S.C. 3471). Title 38,
        United States Code, allows us to ask for this information. We estimate
        that you will need an average of {resBurden} minutes to review the
        instructions, find the information, and complete this form. The VA
        cannot conduct or sponsor a collection of information unless a valid OMB
        (Office of Management and Budget) control number is displayed. You are
        not required to respond to a collection of information if this number is
        not displayed. Valid OMB control numbers can be located on the OMB
        Internet Page at www.reginfo.gov/public/do/PRAMain. If desired, you can
        call <va-telephone contact={CONTACTS.VA_BENEFITS} international /> to
        get information on where to send comments or suggestions about this
        form.
      </p>

      <p>
        <strong>Privacy Act information:</strong> VA will not disclose
        information collected on this form to any source other than what has
        been authorized under the Privacy Act of 1974 or Title 38, Code of
        Federal Regulations 1.576 for routine uses (i.e., VA sends educational
        forms or letters with a Veteran’s identifying information to the
        Veteran’s school or training establishment to (1) assist the Veteran in
        the completion of claims forms or (2) VA obtains further information as
        may be necessary from the school for VA to properly process the
        Veteran’s education claim or to monitor his or her progress during
        training) as identified in the VA system of records. 58VA21/22/28,
        Compensation, Pension, Education, and Veteran Readiness and Employment
        Records - VA, published in the Federal Register. Your response is
        required to obtain or retain benefits under this cost-free IBM
        SkillsBuild Cybersecurity Training Program. While you do not have to
        respond, VA cannot consider you approved to participate until we receive
        this information per (38 U.S.C. 3452(b) and 3501(a)). Your responses are
        confidential (38 U.S.C. 5701). Information submitted is subject to
        verification through computer matching programs with other agencies.
      </p>
    </va-omb-info>
  );
};

export default OmbInfo;
