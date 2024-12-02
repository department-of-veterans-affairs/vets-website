import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SaveInProgressWarning from '../../../../components/FormAlerts/SaveInProgressWarning';

describe('ezr <SaveInProgressWarning>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<SaveInProgressWarning type="dependent" />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
