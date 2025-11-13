import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import NeedHelp from './NeedHelp';

describe('VASS Component: NeedHelp', () => {
  it('should show contact information', () => {
    const screen = render(<NeedHelp />);

    expect(screen.getByTestId('help-footer')).to.exist;

    expect(screen.getByTestId('solid-start-telephone')).to.exist;
    expect(screen.getByTestId('veterans-crisis-line-telephone')).to.exist;
    expect(screen.getByTestId('veterans-crisis-line-text-telephone')).to.exist;
    expect(screen.getByTestId('emergency-telephone')).to.exist;
    expect(
      screen.getByRole('link', { name: /va solid start/i }),
    ).to.have.attribute(
      'href',
      'https://benefits.va.gov/benefits/solid-start.asp?trk=public_post_comment-text',
    );
  });
});
