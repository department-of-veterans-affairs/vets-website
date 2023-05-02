import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialConfirmation from '../../../components/FormPages/FinancialConfirmation';

describe('hca FinancialConfirmation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  it('should render', () => {
    const view = render(<FinancialConfirmation {...props} />);
    const selector = view.container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'Confirm that you do not want to share your household financial information',
    );
  });

  it('should render progress buttons', () => {
    const view = render(<FinancialConfirmation {...props} />);
    expect(
      view.container.querySelectorAll('.hca-progress-button'),
    ).to.have.lengthOf(2);
  });
});
