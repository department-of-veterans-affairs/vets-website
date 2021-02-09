import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import ContactInfoPage from '../../../project-cheetah/components/ContactInfoPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { cleanup } from 'axe-core';

describe('VAOS <ContactInfoPage>', () => {
  it('should submit with valid data', async () => {
    const store = createTestStore();

    let screen = renderWithStoreAndRouter(<ContactInfoPage />, {
      store,
    });

    let input = await screen.findByLabelText(/^Your phone number/);
    userEvent.type(input, '5555555555');

    input = screen.getByLabelText(/^Your email address/);
    userEvent.type(input, 'joe.blow@gmail.com');

    // it should display page heading
    expect(screen.getByText('Confirm your contact information')).to.be.ok;
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

    expect(await screen.findByText(/^Please enter a 10-digit phone number/)).to
      .be.ok;
    expect(screen.getByText(/^Please provide a response/)).to.be.ok;

    userEvent.click(button);
    expect(screen.history.push.called).to.be.false;
  });
});
