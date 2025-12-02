import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyAccordion from '../../components/PrivacyAccordion';

describe('<PrivacyAccordion />', () => {
  it('should contain the correct privacy text', () => {
    const { getByTestId } = render(<PrivacyAccordion />);

    const privacyActNotice = getByTestId('privacy-act');
    expect(privacyActNotice).to.exist;
    expect(privacyActNotice.textContent).to.contain(
      'VA will not disclose information collected on this form',
    );
    expect(privacyActNotice.textContent).to.contain('Privacy Act of 1974');
    expect(privacyActNotice.textContent).to.contain(
      '58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness and Employment Records',
    );
  });

  it('should contain the correct respondent burden text', () => {
    const { getByTestId } = render(<PrivacyAccordion />);

    const respondentBurdenNotice = getByTestId('respondent-burden');
    expect(respondentBurdenNotice).to.exist;
    expect(respondentBurdenNotice.textContent).to.contain(
      'An agency may not conduct or sponsor, and a person is not required to',
    );
    expect(respondentBurdenNotice.textContent).to.contain(
      'VACOPaperworkReduAct@va.gov',
    );
    expect(respondentBurdenNotice.textContent).to.contain(
      'Please refer to OMB Control No. 2900-0695 in any correspondence',
    );
  });
});
