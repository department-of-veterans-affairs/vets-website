import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NotInPilotAlert from '../../components/NotInPilotAlert/NotInPilotAlert';

describe('NotInPilotAlert', () => {
  const getNotInPilotAlert = () => render(<NotInPilotAlert />);

  it('renders alert', () => {
    const { getByTestId } = getNotInPilotAlert();
    expect(getByTestId('not-in-pilot-alert')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getNotInPilotAlert();
    expect(getByTestId('not-in-pilot-alert-heading').textContent).to.eq(
      'Accredited Representative Portal is currently in pilot',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getNotInPilotAlert();
    expect(getByTestId('not-in-pilot-alert-description')).to.exist;
  });
});
