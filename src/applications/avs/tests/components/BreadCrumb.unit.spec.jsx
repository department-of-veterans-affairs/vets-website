import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import BreadCrumb from '../../components/BreadCrumb';

describe('Avs: BreadCrumb', () => {
  it('correctly renders with past appointment referrer available', async () => {
    const referrer = 'http://example.com/my-health/appointments/past/1234';
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', {
      value: referrer,
      configurable: true,
    });

    const screen = render(<BreadCrumb />);
    expect(screen.getByRole('link')).to.have.text(
      'Back to appointment details',
    );
    expect(screen.getByRole('link')).to.have.property('href', referrer);

    Object.defineProperty(document, 'referrer', { value: originalReferrer });
  });

  it('does not render without past appointment referrer available', async () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', {
      value: 'http://example.com/my-health/secure-messages',
      configurable: true,
    });

    const screen = render(<BreadCrumb />);
    expect(screen.queryByRole('link')).not.to.exist;

    Object.defineProperty(document, 'referrer', { value: originalReferrer });
  });
});
