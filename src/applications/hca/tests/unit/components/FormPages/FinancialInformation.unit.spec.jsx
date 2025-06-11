import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FinancialInformation from '../../../../components/FormPages/FinancialInformation';

describe('hca Financial Information page', () => {
  const subject = () => {
    const props = { data: {}, goBack: () => {}, goForward: () => {} };
    const { container } = render(<FinancialInformation {...props} />);
    const selectors = () => ({
      continueBtn: container.querySelector('.usa-button-primary'),
      backBtn: container.querySelector('.usa-button-secondary'),
    });
    return { container, selectors };
  };

  it('should render the page with content and navigation buttons', () => {
    const { container, selectors } = subject();
    const { continueBtn, backBtn } = selectors();
    expect(container).to.not.be.empty;
    expect(continueBtn).to.exist;
    expect(backBtn).to.exist;
  });
});
