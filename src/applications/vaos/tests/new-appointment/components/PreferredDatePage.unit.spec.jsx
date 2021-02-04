import React from 'react';
import { expect } from 'chai';
import moment from 'moment';

import PreferredDatePage from '../../../new-appointment/components/PreferredDatePage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
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

describe('VAOS integration: preferred date page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should render', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePage />, {
      store,
    });

    expect(
      await screen.findByText(
        /What is the earliest date you’d like to be seen/,
      ),
    ).to.exist;

    expect(screen.baseElement).to.contain.text(
      'Tell us when you want to schedule your appointment',
    );

    expect(screen.baseElement).to.contain.text(
      'Please pick a date within the next 13 months.',
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
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /year/i }),
      '2016',
    );
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
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /year/i }),
      '2050',
    );
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
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /year/i }),
      maxYear,
    );
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
  });
});
