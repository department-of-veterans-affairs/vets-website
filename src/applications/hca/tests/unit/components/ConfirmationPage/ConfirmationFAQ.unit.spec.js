import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationFAQ from '../../../../components/ConfirmationPage/ConfirmationFAQ';

describe('hca <ConfirmationFAQ>', () => {
  context('when the component renders', () => {
    it('should contain FAQ content', () => {
      const { container } = render(<ConfirmationFAQ />);
      const selector = container.querySelectorAll('.hca-confirmation-faq');
      expect(container).to.not.be.empty;
      expect(selector.length).to.be.greaterThan(0);
    });
  });
});
