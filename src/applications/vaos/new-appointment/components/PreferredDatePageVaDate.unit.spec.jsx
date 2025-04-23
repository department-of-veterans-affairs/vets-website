import React from 'react';
import { expect } from 'chai';
import { addDays, addYears, format, isAfter, set } from 'date-fns';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import PreferredDatePageVaDate from './PreferredDatePageVaDate';

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

describe('VAOS Page: PreferredDatePageVaDate', () => {
  beforeEach(() => mockFetch());

  it('should display form fields', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    const dateSelector = screen.container.querySelector('va-date');
    await waitFor(() => {
      // Verify date widget is rendered.
      expect(dateSelector).to.exist;
      expect(dateSelector).to.have.attribute(
        'label',
        "Tell us the earliest day you're available and we'll try to find the date closest to your request.",
      );
    });

    expect(screen.baseElement).to.contain.text(
      'When are you available for this appointment?',
    );

    expect(screen.baseElement).to.contain.text(
      'Choose a date within the next 13 months for this appointment.',
    );
  });

  it('should submit form with default date', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    const dateSelector = screen.container.querySelector('va-date');
    await waitFor(() => {
      // Verify date widget is rendered.
      expect(dateSelector).to.exist;
      expect(dateSelector.value).to.equal(
        // Note that although the format of the date saved in the state is 'yyyy-MM-dd', the date
        // represented by the value attribute rendered by va-date uses the 'yyyy-M-d' format.
        format(addDays(new Date(), 1), 'yyyy-M-d'),
      );
    });

    fireEvent.click(await screen.findByText(/Continue/));

    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'You must provide a response',
    // );
    // expect(screen.history.push.called).to.be.false;
    expect(screen.history.push.called).to.be.true;

    // Do not record preferred-date-modified event
    expect(window.dataLayer).not.to.deep.include({
      event: 'vaos-preferred-date-modified',
    });
  });

  it('it should not submit with past date', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    await screen.findByText(/Continue/);

    const vaDate = screen.container.querySelector('va-date');
    vaDate.__events.dateChange({
      target: { value: format(new Date(2016, 2, 2), 'yyyy-MM-dd') },
    });

    fireEvent.click(screen.getByText(/Continue/));
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'Please enter a future date ',
    // );
    expect(screen.history.push.called).to.be.false;
  });

  it('it should not submit beyond 395 days into the future', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    await screen.findByText(/Continue/);
    const vaDate = screen.container.querySelector('va-date');
    vaDate.__events.dateChange({
      target: { value: format(addDays(new Date(), 396), 'yyyy-MM-dd') },
    });
    fireEvent.click(screen.getByText(/Continue/));
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'Please enter a date less than 395 days in the future ',
    // );
    expect(screen.history.push.called).to.be.false;
  });

  it('it should not submit with invalid date', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    let date = new Date();
    if (isAfter(date, set(date, { month: 1, date: 27 }))) {
      date = addYears(date, 1);
    }

    await screen.findByText(/Continue/);
    const vaDate = screen.container.querySelector('va-date');
    vaDate.__events.dateChange({
      target: {
        // the next February 31th is not a valid date
        value: `${format(date, 'yyyy')}-02-31`,
      },
    });
    fireEvent.click(screen.getByText(/Continue/));
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'Please enter a valid date ',
    // );
    expect(screen.history.push.called).to.be.false;
  });

  it('should submit with valid date', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<PreferredDatePageVaDate />, {
      store,
    });

    await screen.findByText(/Continue/);

    const vaDate = screen.container.querySelector('va-date');
    vaDate.__events.dateChange({
      target: { value: format(addDays(new Date(), 395), 'yyyy-MM-dd') },
    });

    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
    // Record preferred-date-modified event
    expect(window.dataLayer).to.deep.include({
      event: 'vaos-preferred-date-modified',
    });
  });
});
