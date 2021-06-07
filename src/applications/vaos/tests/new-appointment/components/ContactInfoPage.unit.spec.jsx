import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import ContactInfoPage from '../../../new-appointment/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { cleanup, waitFor } from '@testing-library/react';
import { FLOW_TYPES } from '../../../utils/constants';

describe('VAOS <ContactInfoPage>', () => {
  it('should submit with valid data', async () => {
    const store = createTestStore({
      user: {
        profile: {
          vapContactInfo: {},
        },
      },
    });

    let screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

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
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    // Expect the previously entered form data is still there if you unmount and remount the page with the same store,
    await cleanup();
    screen = renderWithStoreAndRouter(<ContactInfoPage />, {
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
    let store = createTestStore();

    // Get default state.
    let state = store.getState();
    state = {
      ...state,
      newAppointment: {
        ...state.newAppointment,
        flowType: FLOW_TYPES.REQUEST,
      },
    };
    store = createTestStore(state);

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    // it should display page heading
    expect(screen.getByText('Your contact information')).to.be.ok;

    expect(await screen.getByText(/^Please choose at least one option/)).to.be
      .ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });

  it('should prepopulate VA Profile info', async () => {
    const store = createTestStore({
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: 'test@va.gov',
            },
            mobilePhone: {
              areaCode: '555',
              countryCode: '1',
              phoneNumber: '5555559',
            },
          },
        },
      },
    });

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    await screen.findByText(/^Continue/);
    expect(screen.getByLabelText(/phone number/i).value).to.equal('5555555559');
    expect(screen.getByLabelText(/email/i).value).to.equal('test@va.gov');
  });

  it('should not display "best time to call" for direct schedule appointment', async () => {
    let store = createTestStore();

    // Get default state.
    let state = store.getState();
    state = {
      ...state,
      newAppointment: {
        ...state.newAppointment,
        flowType: FLOW_TYPES.DIRECT,
      },
    };
    store = createTestStore(state);

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    expect(screen.queryByText('What are the best times for us to call you?')).to
      .not.exist;
  });
});
