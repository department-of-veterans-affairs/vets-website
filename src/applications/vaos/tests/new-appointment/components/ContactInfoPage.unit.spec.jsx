import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import ContactInfoPage from '../../../new-appointment/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';

describe('VAOS <ContactInfoPage>', () => {
  it('should render', async () => {
    const store = createTestStore({
      newAppointment: {
        pages: [],
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    expect(await screen.findByText('Your contact information')).to.be.ok;
  });

  it('should not submit empty form', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {
          calendarData: {},
        },
        eligibility: [],
        pages: [],
        previousPages: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={ContactInfoPage} />,
      {
        store,
      },
    );

    // it should display page heading
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Your contact information/i,
      }),
    ).to.be.ok;

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    expect(screen.findByText(/^Please enter a phone number/)).to.be.ok;
    expect(screen.findByText(/^Please choose at least one option/)).to.be.ok;
    expect(screen.findByText(/^Please provide a response/)).to.be.ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });

  it('should call updateFormData after change', async () => {
    const store = createTestStore({
      newAppointment: {
        pages: [],
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    // it should display page heading
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Your contact information/i,
      }),
    ).to.be.ok;

    const input = document.getElementById('root_phoneNumber');
    expect(input.value).to.equal('');

    userEvent.type(input, '5555555555');

    expect(input.value).to.equal('5555555555');
  });

  it('should submit with valid data', async () => {
    const store = createTestStore({
      newAppointment: {
        pages: [],
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={ContactInfoPage} />,
      {
        store,
      },
    );

    // it should display page heading
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Your contact information/i,
      }),
    ).to.be.ok;

    let input = document.getElementById('root_phoneNumber');
    userEvent.type(input, '5555555555');

    const checkbox = document.getElementById('root_bestTimeToCall_morning');
    userEvent.click(checkbox);

    input = document.getElementById('root_email');
    userEvent.type(input, 'joe.blow@gmail.com');

    const button = await screen.findByText(/^Continue/);

    userEvent.click(button);
    expect(screen.history.push.called).to.be.true;
  });
});
