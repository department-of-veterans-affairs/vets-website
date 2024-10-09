import React from 'react';
import { expect } from 'chai';
// import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import ChooseDateAndTime from '../../referral-appointments/ChooseDateAndTime';

// Tests skipped for now since there are issues with displaying TZ and redux/data in flux.
describe('VAOS referral-appointments', () => {
  const store = createTestStore();
  // it.skip('should store the selected date', async () => {
  //   const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
  //     store,
  //   });
  // });
  it.skip('should validate on submit', async () => {
    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store,
    });
    const button = await screen.findByText(/^Continue/);

    userEvent.click(button);
    expect(
      screen.findByText(
        'Please choose your preferred date and time for your appointment',
      ),
    ).to.be.ok;
  });
  // it('should display the timezone in the correct format', async () => {

  // });
});
