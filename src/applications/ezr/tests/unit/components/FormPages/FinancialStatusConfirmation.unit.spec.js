import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import FinancialStatusConfirmation from '../../../../components/FormPages/FinancialStatusConfirmation';

describe('ezr Financial Status Confirmation page', () => {
  const getData = () => ({
    props: { goBack: () => {}, goForward: sinon.spy() },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render `va-alert` with correct status', () => {
      const { container } = render(<FinancialStatusConfirmation {...props} />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'info');
    });

    it('should render navigation buttons', () => {
      const { container } = render(<FinancialStatusConfirmation {...props} />);
      expect(
        container.querySelectorAll('button', '.form-progress-buttons'),
      ).to.have.lengthOf(2);
    });
  });
});
