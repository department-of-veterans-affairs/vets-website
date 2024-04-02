import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NewsletterSignup from '../../components/NewsletterSignup';

describe('MHV landing page', () => {
  describe('NewsletterSignup', () => {
    it('renders', () => {
      const { getByRole } = render(<NewsletterSignup />);

      expect(getByRole('heading')).to.exist;
      const link = getByRole('link');
      expect(link).to.exist;
      expect(link.href).to.exist;
      expect(link.target).to.equal('_blank');
    });
  });
});
