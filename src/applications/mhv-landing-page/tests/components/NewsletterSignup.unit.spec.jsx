import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NewsletterSignup from '../../components/NewsletterSignup';

describe('MHV landing page', () => {
  describe('NewsletterSignup', () => {
    it('renders', () => {
      const { getByRole } = render(<NewsletterSignup />);

      const input = getByRole('textbox');
      expect(input.getAttribute('type')).to.equal('email');

      const submit = getByRole('button');
      expect(submit).to.exist;
    });
  });
});
