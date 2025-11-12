import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DisclaimerActivity from '../../../components/activities/DisclaimerActivity';

describe('DisclaimerActivity', () => {
  it('renders AI disclaimer title, body text, accessibility attributes, and classes', () => {
    const { getByText, getByRole } = render(
      <DisclaimerActivity text="Use AI responsibly." />,
    );

    // Title and body
    expect(getByText('AI disclaimer')).to.exist;
    expect(getByText('Use AI responsibly.')).to.exist;

    // Accessibility
    const note = getByRole('note');
    expect(note).to.exist;
    expect(note.getAttribute('aria-live')).to.equal('polite');

    // Classes
    expect(note.className).to.include('va-disclaimer');
    expect(note.className).to.include('va-disclaimer--ai');
  });
});
