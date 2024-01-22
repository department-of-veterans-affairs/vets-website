import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import IdentityNotVerified from '../../../authorization/components/IdentityNotVerified';

describe('IdentityNotVerified component', () => {
  let view;
  describe('when only passed a headline prop', () => {
    const headline = 'The alert headline';
    beforeEach(() => {
      view = render(<IdentityNotVerified {...{ headline }} />);
    });
    it('renders the correct alert headline', () => {
      expect(view.getByText(headline)).to.exist;
    });
    it('renders the correct alert content', () => {
      expect(view.getByText(/We need to make sure you’re you/i)).to.exist;
      expect(view.getByText(/your personal and health-related information/i)).to
        .exist;
    });
    it('renders the correct CTA', () => {
      expect(
        view.getByRole('link', { name: 'Verify your identity' }),
      ).to.have.attr('href', '/verify');
    });
    it('renders Learn how to verify your identity link', () => {
      expect(view.getByTestId('verify-identity-link')).to.have.attr(
        'href',
        '/resources/verifying-your-identity-on-vagov/',
      );
    });
  });
});
