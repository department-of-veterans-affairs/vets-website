import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import BreadCrumb from '../../components/BreadCrumb';

describe('Avs: BreadCrumb', () => {
  it('correctly renders with referrer available', async () => {
    const referrer = 'http://example.com/foo/bar';
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

  it('correctly renders without referrer available', async () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', {
      value: '',
      configurable: true,
    });

    const screen = render(<BreadCrumb />);
    expect(screen.getByRole('link')).to.have.text(
      'Back to appointment details',
    );
    expect(screen.getByRole('link'))
      .property('href')
      .to.match(/\/#$/);

    Object.defineProperty(document, 'referrer', { value: originalReferrer });
  });
});
