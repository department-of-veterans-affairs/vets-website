import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PreferredFacilityAlert from '../../../../components/FormAlerts/PreferredFacilityAlert';

describe('ezr <PreferredFacilityAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `error`', () => {
      const { container } = render(<PreferredFacilityAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');
    });
  });
});
