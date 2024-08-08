import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import ContactInfoPage from '../../../new-appointment/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../utils/constants';

describe('VAOS Page: ContactInfoPage', () => {
  // Flaky test: https://github.com/department-of-veterans-affairs/va.gov-team/issues/82968
  it.skip('should accept email, phone, and preferred time and continue', async () => {
    const store = createTestStore({
      user: {
        profile: {
          vapContactInfo: {},
        },
      },
      newAppointment: {
        data: {
          facilityType: FACILITY_TYPES.VAMC,
        },
        flowType: FLOW_TYPES.DIRECT,
        previousPages: {},
      },
    });

    let screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    let input = await screen.findByLabelText(/^Your phone number/);
    userEvent.type(input, '5555555555');

    input = screen.getByLabelText(/^Your email address/);
    userEvent.type(input, 'joe.blow@gmail.com');

    // it should display page heading and description
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
    expect(
      screen.getByText(
        /We’ll use this information if we need to contact you about this appointment. For most other VA communications, we'll use the contact information in your VA.gov profile/i,
      ),
    ).to.be.ok;

    expect(
      screen.getByText(
        /Want to update your contact information for more VA benefits and services\?/,
      ),
    ).to.be.ok;
    const button = await screen.findByText(/^Continue/);

    userEvent.click(button);
    expect(screen.history.push.called).to.be.true;
    expect(window.dataLayer).to.deep.include({
      event: 'vaos-contact-info-email-not-populated',
    });
    expect(window.dataLayer).to.deep.include({
      event: 'vaos-contact-info-phone-not-populated',
    });

    // Expect the previously entered form data is still there if you unmount and remount the page with the same store,
    await cleanup();
    screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    input = await screen.findByLabelText(/^Your phone number/);
    expect(input.value).to.equal('5555555555');

    input = screen.getByLabelText(/^Your email address/);
    expect(input.value).to.equal('joe.blow@gmail.com');
  });

  it('should show validation errors for email and phone', async () => {
    let store = createTestStore();

    // Get default state.
    let state = store.getState();
    state = {
      ...state,
      newAppointment: {
        ...state.newAppointment,
        flowType: FLOW_TYPES.REQUEST,
        data: {
          facilityType: 'communityCare',
        },
      },
    };
    store = createTestStore(state);

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    // it should display page heading
    expect(screen.getByText('How should we contact you?')).to.be.ok;

    expect(await screen.getByText(/^Please choose at least one option/)).to.be
      .ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });

  it('should prepopulate email and phone from VA Profile', async () => {
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
    await waitFor(() => {
      expect(window.dataLayer).to.deep.include({
        event: 'vaos-contact-info-email-populated',
      });
      expect(window.dataLayer).to.deep.include({
        event: 'vaos-contact-info-phone-populated',
      });
    });

    userEvent.click(screen.getByLabelText(/^Morning \(8:00 a.m. – noon\)/));

    userEvent.click(screen.getByText(/^Continue/));

    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    expect(window.dataLayer).to.deep.include({
      event: 'vaos-contact-info-email-not-changed',
    });
    expect(window.dataLayer).to.deep.include({
      event: 'vaos-contact-info-phone-not-changed',
    });
  });

  it('when in direct schedule flow, should not show preferred time field', async () => {
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

  it('should show email exceeded max length', async () => {
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

    let input = await screen.findByLabelText(/^Your phone number/);
    fireEvent.change(input, { target: { value: '5555555555' } });

    input = screen.getByLabelText(/^Your email address/);
    userEvent.type(
      input,
      '12345678901234567890123456789012345678901234567890.blow@some.com',
    );

    userEvent.click(screen.getByText(/continue/i));
    expect(screen.history.push.called).to.be.false;

    expect(await screen.findByRole('alert')).to.contain.text(
      'We don’t support email addresses that exceed 50 characters',
    );
  });
});
