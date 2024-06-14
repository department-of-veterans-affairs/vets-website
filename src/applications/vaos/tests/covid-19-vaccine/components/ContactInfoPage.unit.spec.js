import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { cleanup } from '@testing-library/react';
import ContactInfoPage from '../../../covid-19-vaccine/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

describe('VAOS Page: ContactInfoPage', () => {
  it('should submit with valid data', async () => {
    const store = createTestStore();

    let screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    let input = await screen.findByLabelText(/^Your phone number/);
    userEvent.type(input, '5555555555');

    input = screen.getByLabelText(/^Your email address/);
    userEvent.type(input, 'joe.blow@gmail.com');

    // it should display page heading and description
    expect(screen.getByText('Confirm your contact information')).to.be.ok;
    expect(
      screen.getByText(
        /We’ll use this information to contact you about your appointment\. Any updates you make here will only apply to VA online appointment scheduling/i,
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

  it('should not submit empty form', async () => {
    const store = createTestStore();

    const screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    // it should display page heading
    expect(screen.getByText('Confirm your contact information')).to.be.ok;

    expect(
      await screen.findByText(
        /^Please enter a valid 10-digit phone number \(with or without dashes\)/,
      ),
    ).to.be.ok;
    expect(screen.getByText(/^Please enter an email address/)).to.be.ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });

  it('should prefill email and phone, and reenter the form data if user changed it and remounted the page', async () => {
    const initialState = {
      covid19Vaccine: {
        newBooking: {
          data: {},
          pages: [],
          previousPages: [],
        },
      },
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: 'iquickley@gmail.com',
            },
            mobilePhone: {
              areaCode: '973',
              phoneNumber: '7773614',
            },
          },
        },
      },
    };
    const store = createTestStore(initialState);

    let screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    // Phone and email should be prefilled based on vapContactInfo
    let input = await screen.findByLabelText(/^Your phone number/);
    expect(input.value).to.equal('9737773614');

    input = screen.getByLabelText(/^Your email address/);
    expect(input.value).to.equal('iquickley@gmail.com');

    // Simulate user changing email and phone
    userEvent.clear(input);
    userEvent.type(input, 'joe.blow@gmail.com');
    expect(input.value).to.equal('joe.blow@gmail.com');

    input = await screen.findByLabelText(/^Your phone number/);
    userEvent.clear(input);
    userEvent.type(input, '5555555555');
    expect(input.value).to.equal('5555555555');

    // it should display page heading
    expect(screen.getByText('Confirm your contact information')).to.be.ok;
    const button = await screen.findByText(/^Continue/);

    userEvent.click(button);
    expect(screen.history.push.called).to.be.true;

    // Expect user entered form data is still there if you unmount and
    // remount the page with the same store, instead of vap contact info
    await cleanup();
    screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    input = await screen.findByLabelText(/^Your phone number/);
    expect(input.value).to.equal('5555555555');

    input = screen.getByLabelText(/^Your email address/);
    expect(input.value).to.equal('joe.blow@gmail.com');
  });
});
