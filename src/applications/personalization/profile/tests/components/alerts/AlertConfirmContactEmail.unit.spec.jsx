import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { AlertConfirmContactEmail } from '~/applications/personalization/profile/components/alerts/AlertConfirmContactEmail';

describe('AlertConfirmContactEmail', () => {
  it('renders', () => {
    const { getByText } = render(<AlertConfirmContactEmail />);
    const h2Content = /Confirm your contact email address/;
    expect(getByText(h2Content)).to.exist;
    const pContent = /We’ll send all VA notifications to the contact email/;
    expect(getByText(pContent)).to.exist;
  });
});
