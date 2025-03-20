import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialStatusWarning from '../../../../components/FormAlerts/FinancialStatusWarning';

describe('ezr <FinancialStatusWarning>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<FinancialStatusWarning />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
