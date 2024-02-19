import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ShortFormAlert from '../../../../components/FormAlerts/ShortFormAlert';

describe('hca <ShortFormAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert-expandable` with status of `success`', () => {
      const { container } = render(<ShortFormAlert />);
      const selector = container.querySelector('va-alert-expandable');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'success');
    });
  });
});
