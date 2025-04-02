import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FinancialConfirmation from '../../../../components/FormPages/FinancialConfirmation';

describe('hca Financial Confirmation page', () => {
  const subject = () => {
    const props = { data: {}, goBack: () => {}, goForward: () => {} };
    const { container } = render(<FinancialConfirmation {...props} />);
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
      navBtns: container.querySelectorAll('.hca-button-progress'),
    });
    return { container, selectors };
  };

  it('should render the page with content and navigation buttons', () => {
    const { selectors } = subject();
    const { vaAlert, navBtns } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'info');
    expect(navBtns).to.have.lengthOf(2);
  });
});
