import { render } from '@testing-library/react';
import { expect } from 'chai';

import VerifiedPrefillAlert from '../../../../components/FormAlerts/VerifiedPrefillAlert';

describe('ezr <VerifiedPrefillAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(VerifiedPrefillAlert);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'info');
    });
  });
});
