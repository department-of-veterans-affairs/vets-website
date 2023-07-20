import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DisabilityConfirmation from '../../../components/FormPages/DisabilityConfirmation';

describe('hca DisabilityConfirmation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  describe('when the component renders', () => {
    it('should render `va-alert` with correct title', () => {
      const { container } = render(<DisabilityConfirmation {...props} />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'Confirm that you receive service-connected pay for a 50% or higher disability rating',
      );
    });

    it('should render navigation buttons', () => {
      const { container } = render(<DisabilityConfirmation {...props} />);
      expect(
        container.querySelectorAll('.hca-progress-button'),
      ).to.have.lengthOf(2);
    });
  });
});
