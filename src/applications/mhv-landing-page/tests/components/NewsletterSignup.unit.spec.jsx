import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NewsletterSignup from '../../components/NewsletterSignup';

describe('MHV landing page', () => {
  describe('NewsletterSignup', () => {
    it('renders', () => {
      const { getByRole } = render(<NewsletterSignup />);

      expect(getByRole('heading')).to.exist;
      expect(getByRole('link')).to.exist;
      expect(getByRole('link').href).to.exist;
    });
  });
});
