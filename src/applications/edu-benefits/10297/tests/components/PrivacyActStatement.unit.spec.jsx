import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyActStatement from '../../components/PrivacyActStatement';

describe('<PrivacyActStatement />', () => {
  it('should render Privacy Act Statement', () => {
    const { container } = render(<PrivacyActStatement />);
    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-statement"]',
    );

    expect(privacyActStatement).to.exist;
    expect(privacyActStatement.textContent).to.contain(
      'The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974',
    );
    expect(privacyActStatement.textContent).to.contain(
      'Your response is required to obtain or retain education benefits',
    );
  });

  it('should contain all required privacy policy content', () => {
    const { container } = render(
      <PrivacyActStatement showRespondentBurden={false} />,
    );
    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-statement"]',
    );

    expect(privacyActStatement.textContent).to.contain(
      'Privacy Act of 1974 or title 38, Code of Federal Regulations, section 1.576',
    );
    expect(privacyActStatement.textContent).to.contain(
      'VA system of records, 58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness and Employment Records - VA',
    );
    expect(privacyActStatement.textContent).to.contain(
      'Giving us your SSN account information is voluntary',
    );
    expect(privacyActStatement.textContent).to.contain(
      'VA cannot process your claim for education assistance unless the information is furnished as required by existing law (38 U.S.C. 3471)',
    );
    expect(privacyActStatement.textContent).to.contain(
      'Any information provided by applicants, recipients, and others may be subject to verification through computer matching programs with other agencies',
    );
  });
});
