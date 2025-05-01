import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import NeedHelp from './NeedHelp';

describe('VAOS Component: NeedHelp', () => {
  it('should show contact information', () => {
    const screen = render(<NeedHelp />);

    expect(screen.getByRole('heading', { level: 2, name: /need help/i })).to
      .exist;

    expect(screen.getByTestId('technical-issue-telephone')).to.exist;
    expect(screen.getByTestId('video-question-telephone')).to.exist;
    expect(
      screen.getByRole('link', { name: /find your health facility/i }),
    ).to.have.attribute('href', '/find-locations');
  });
});
