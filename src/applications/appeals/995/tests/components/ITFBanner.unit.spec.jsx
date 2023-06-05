import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ITFBanner from '../../components/ITFBanner';

describe('ITFBanner', () => {
  it('should render an error message', async () => {
    const { container } = render(<ITFBanner status="error" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain(
      'We’re sorry. Something went wrong on our end.',
    );
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render an itf found message', async () => {
    const { container } = render(<ITFBanner status="itf-found" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain('You already have an Intent to File');
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render an itf created message', async () => {
    const { container } = render(<ITFBanner status="itf-created" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain('You submitted an Intent to File');
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should throw an error', () => {
    expect(() => {
      render(<ITFBanner status="nonsense" />);
    }).to.throw();
  });
});
