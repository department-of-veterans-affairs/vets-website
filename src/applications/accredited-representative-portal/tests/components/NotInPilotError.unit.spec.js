import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NotInPilotError from '../../components/NotInPilotError/NotInPilotError';

describe('NotInPilotError', () => {
  const getNotInPilotError = () => render(<NotInPilotError />);

  it('renders error', () => {
    const { getByTestId } = getNotInPilotError();
    expect(getByTestId('not-in-pilot-error')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getNotInPilotError();
    expect(getByTestId('not-in-pilot-error-heading').textContent).to.equal(
      'Accredited Representative Portal is currently in pilot',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getNotInPilotError();
    expect(getByTestId('not-in-pilot-error-description')).to.exist;
  });
});
