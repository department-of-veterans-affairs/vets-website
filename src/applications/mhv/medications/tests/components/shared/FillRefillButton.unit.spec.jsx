import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import FillRefillButton from '../../../components/shared/FillRefillButton';

describe('Fill Refill Button component', () => {
  const rx = {
    cmopDivisionPhone: '1234567890',
    dispensedDate: '2023-08-04T04:00:00.000Z',
    error: true,
    prescriptionId: 1234567890,
    refillRemaining: 1,
    dispStatus: 'Active',
    success: true,
  };
  const setup = () => {
    return renderWithStoreAndRouter(<FillRefillButton {...rx} />, {
      initialState: {},
      reducers: reducer,
      path: '/1234567890',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders a success message', () => {
    const screen = setup();
    const successMessage = screen.getByText(
      'The fill request has been submitted successfully',
    );
    expect(successMessage).to.exist;
  });

  it('renders an error message', () => {
    const screen = setup();
    const errorMessage = screen.getByText(
      'We didn’t get your [fill/refill] request. Try again.',
    );
    expect(errorMessage).to.exist;
  });
});
