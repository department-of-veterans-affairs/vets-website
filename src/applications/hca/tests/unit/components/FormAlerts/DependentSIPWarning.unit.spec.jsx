import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentSIPWarning from '../../../../components/FormAlerts/DependentSIPWarning';

describe('hca <DependentSIPWarning>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<DependentSIPWarning />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
