import React from 'react';
import { renderWithRouter } from '../../utils';

import ClaimLetterSection from '../../../components/claim-letters/ClaimLetterSection';

describe('<ClaimLetterSection>', () => {
  it('should render a ClaimLetterSection section', () => {
    const screen = renderWithRouter(<ClaimLetterSection />);

    screen.getByText('Your claim letters');
    screen.getByText('Download your VA claim letters');
    screen.getByText(
      'You can download your decision letter(s) online. You can also get other letters related to your claims and appeals.',
    );
  });
});
