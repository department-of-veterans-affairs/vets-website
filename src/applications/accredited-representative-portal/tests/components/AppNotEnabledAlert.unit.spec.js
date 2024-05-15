import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AppNotEnabledAlert from '../../components/AppNotEnabledAlert/AppNotEnabledAlert';

describe('AppNotEnabledAlert', () => {
  const getAppNotEnabledAlert = () => render(<AppNotEnabledAlert />);

  it('renders alert', () => {
    const { getByTestId } = getAppNotEnabledAlert();
    expect(getByTestId('app-not-enabled-alert')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getAppNotEnabledAlert();
    expect(getByTestId('app-not-enabled-alert-heading').textContent).to.eq(
      'The Accredited Representative Portal is not available yet',
    );
  });
});
