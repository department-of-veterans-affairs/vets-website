import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PerformanceWarning from '../../../../components/FormAlerts/PerformanceWarning';

describe('hca <PerformanceWarning>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<PerformanceWarning />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
