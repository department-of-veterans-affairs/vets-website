import React from 'react';
import { expect } from 'chai';
import moment from 'moment';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import PreferredDatePage from '../../../new-appointment/components/PreferredDatePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

describe('VAOS Page: PreferredDatePage', () => {
  beforeEach(() => mockFetch());

  it('should display form fields', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    expect(
      await screen.findByText(
        /Tell us the earliest day you're available and we'll try to find the date closest to your request/,
      ),
    ).to.exist;

    expect(screen.baseElement).to.contain.text(
      'When do you want to schedule this appointment?',
    );

    expect(screen.baseElement).to.contain.text(
      'Choose a date within the next 13 months for this appointment.',
    );

    // Verify date widget is rendered.
    expect(screen.getAllByRole('combobox').length).to.equal(2);
    expect(screen.getAllByRole('spinbutton').length).to.equal(1);
  });

  it('should not submit empty form', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    fireEvent.click(await screen.findByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
    expect(screen.history.push.called).to.be.false;
  });

  it('it should not submit with past date', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    await screen.findByText(/Continue/);

    userEvent.selectOptions(screen.getByRole('combobox', { name: /month/i }), [
      '2',
    ]);
    userEvent.selectOptions(screen.getByRole('combobox', { name: /day/i }), [
      '2',
    ]);
    userEvent.type(screen.getByRole('spinbutton', { name: /year/i }), '2016');
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please enter a future date ',
    );
    expect(screen.history.push.called).to.be.false;
  });

  it('it should not submit beyond 395 days into the future', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    await screen.findByText(/Continue/);

    userEvent.selectOptions(screen.getByRole('combobox', { name: /month/i }), [
      '2',
    ]);
    userEvent.selectOptions(screen.getByRole('combobox', { name: /day/i }), [
      '2',
    ]);
    userEvent.type(screen.getByRole('spinbutton', { name: /year/i }), '2050');
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please enter a date less than 395 days in the future ',
    );
    expect(screen.history.push.called).to.be.false;
  });

  it('should submit with valid data', async () => {
    const maxMonth = moment()
      .add(395, 'days')
      .format('M');
    const maxDay = moment()
      .add(395, 'days')
      .format('DD')
      .replace(/\b0/g, '');
    const maxYear = moment()
      .add(395, 'days')
      .format('YYYY');

    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    await screen.findByText(/Continue/);

    userEvent.selectOptions(screen.getByRole('combobox', { name: /month/i }), [
      maxMonth,
    ]);
    userEvent.selectOptions(screen.getByRole('combobox', { name: /day/i }), [
      maxDay,
    ]);
    userEvent.type(screen.getByRole('spinbutton', { name: /year/i }), maxYear);
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
  });
});
