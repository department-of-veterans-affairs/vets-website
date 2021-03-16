import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import ContactInfoPage from '../../../new-appointment/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';
import { cleanup } from 'axe-core';

describe('VAOS <ContactInfoPage>', () => {
  it('should submit with valid data', async () => {
    const store = createTestStore({
      newAppointment: {
        pages: [],
        previousPages: [],
      },
    });

    let screen = renderWithStoreAndRouter(
      <Route component={ContactInfoPage} />,
      {
        store,
      },
    );

    let input = await screen.findByLabelText(/^Your phone number/);
    userEvent.type(input, '5555555555');

    let checkbox = screen.getByLabelText(/^Morning \(8 a.m. – noon\)/);
    userEvent.click(checkbox);

    input = screen.getByLabelText(/^Your email address/);
    userEvent.type(input, 'joe.blow@gmail.com');

    // it should display page heading
    expect(screen.getByText('Your contact information')).to.be.ok;
    const button = await screen.findByText(/^Continue/);

    userEvent.click(button);
    expect(screen.history.push.called).to.be.true;

    // Expect the previously entered form data is still there if you unmount and remount the page with the same store,
    await cleanup();
    screen = renderWithStoreAndRouter(<Route component={ContactInfoPage} />, {
      store,
    });

    input = await screen.findByLabelText(/^Your phone number/);
    expect(input.value).to.equal('5555555555');

    checkbox = screen.getByLabelText(/^Morning \(8 a.m. – noon\)/);
    expect(checkbox.checked).to.be.true;

    input = screen.getByLabelText(/^Your email address/);
    expect(input.value).to.equal('joe.blow@gmail.com');
  });

  it('should not submit empty form', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
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

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    // it should display page heading
    expect(screen.getByText('Your contact information')).to.be.ok;

    expect(await screen.findByText(/^Please enter a phone number/)).to.be.ok;
    expect(screen.getByText(/^Please choose at least one option/)).to.be.ok;
    expect(screen.getByText(/^Please provide a response/)).to.be.ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });
});
