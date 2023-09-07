import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ClaimStatusPageContent from '../../../components/evss/ClaimStatusPageContent';

describe('<ClaimStatusPageContent>', () => {
  const claim = {
    attributes: {
      decisionLetterSent: true,
      open: false,
    },
  };

  context('when showClaimLettersLink is "true"', () => {
    it('renders a link to the claim letters page', () => {
      const screen = render(
        <ClaimStatusPageContent claim={claim} showClaimLettersLink />,
      );

      screen.getByText('Get your claim letters');
    });
  });

  context('when showClaimLettersLink is "false"', () => {
    it('does not render a link to the claim letters page', () => {
      const screen = render(<ClaimStatusPageContent claim={claim} />);

      expect(screen.queryByText('Get your claim letters')).not.to.exist;
    });
  });
});
