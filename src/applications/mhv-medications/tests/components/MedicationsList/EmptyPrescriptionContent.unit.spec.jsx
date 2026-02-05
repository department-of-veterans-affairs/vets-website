import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import EmptyPrescriptionContent from '../../../components/MedicationsList/EmptyPrescriptionContent';
import reducers from '../../../reducers';

describe('EmptyPrescriptionContent component', () => {
  const setup = (initialState = {}) =>
    renderWithStoreAndRouterV6(<EmptyPrescriptionContent />, {
      initialState,
      reducers,
    });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the empty medications message heading', () => {
    const screen = setup();

    expect(screen.getByTestId('empty-medList-alert')).to.exist;
    expect(screen.getByTestId('empty-medList-alert').textContent).to.equal(
      'You don’t have any VA prescriptions or medication records',
    );

    const instructionText = screen.getByText(
      /If you need a prescription or you want to tell us about a medication/i,
    );
    expect(instructionText).to.exist;
  });
});
