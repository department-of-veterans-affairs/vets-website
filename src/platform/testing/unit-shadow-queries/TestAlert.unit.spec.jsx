import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { screen } from 'shadow-dom-testing-library';

import TestAlert from './TestAlert';

describe('TestComponent', () => {
  it('renders the info alert', () => {
    const { findByRole } = render(<TestAlert />);
    const alertHeading = findByRole('heading');
    expect(alertHeading.textContent).to.eq('This is an info alert');
  });
  it('renders the info alert (shadow)', async () => {
    render(<TestAlert />);
    const alertHeading = await screen.findByShadowRole('heading');
    expect(alertHeading.textContent).to.eq('This is an info alert');
  });
});
