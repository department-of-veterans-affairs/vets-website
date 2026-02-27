import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';

import { waitFor } from '@testing-library/dom';
import { addDays, addMinutes, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

import { DATE_FORMATS } from '../../utils/constants';
import SecondDosePage from './SecondDosePage';

describe('VAOS vaccine flow: SecondDosePage', () => {
  const start = new Date('2025-08-05T08:00:00-06:00');
  const store = createTestStore({
    covid19Vaccine: {
      newBooking: {
        previousPages: {},
        data: {
          vaFacility: '983var', // the substring (0,3) of the facility ID is used for TimeZone
          clinicId: '455',
          date1: [format(start, DATE_FORMATS.ISODateTime)],
        },
        availableSlots: [
          {
            start: format(start, DATE_FORMATS.ISODateTime),
            end: format(addMinutes(start, 30), DATE_FORMATS.ISODateTime),
          },
        ],
        clinics: {},
        facilities: [
          {
            id: '983var',
            name: 'Cheyenne VA Medical Center',
          },
        ],
      },
    },
  });

  it('should show second vaccine dose information', async () => {
    const screen = renderWithStoreAndRouter(<SecondDosePage />, {
      store,
    });
    const expectedDate = formatInTimeZone(
      start,
      'America/Denver',
      DATE_FORMATS.friendlyWeekdayDate,
    );

    expect(
      await screen.getByText(/When to plan for a second dose/i),
    ).to.have.tagName('h1');

    expect(
      screen.getByText(
        new RegExp(`If you get your first dose of a 2-dose vaccine on`, 'i'),
      ),
    ).to.be.ok;

    expect(screen.getByText(new RegExp(expectedDate, 'i'))).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(
          `, here’s when to plan to come back for your second dose`,
          'i',
        ),
      ),
    ).to.be.ok;
    expect(screen.getByText('Moderna')).to.have.tagName('h2');
    expect(screen.getByText('Pfizer')).to.have.tagName('h2');
    expect(screen.getByText('Johnson & Johnson')).to.have.tagName('h2');
    expect(
      screen.getByText(
        new RegExp(
          `after ${formatInTimeZone(
            addDays(start, 21),
            'America/Denver',
            DATE_FORMATS.friendlyWeekdayDate,
          )}`,
          'i',
        ),
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(
          `after ${formatInTimeZone(
            addDays(start, 28),
            'America/Denver',
            DATE_FORMATS.friendlyWeekdayDate,
          )}`,
          'i',
        ),
      ),
    ).to.be.ok;
  });

  it('should continue to the correct page once continue to clicked', async () => {
    const screen = renderWithStoreAndRouter(<SecondDosePage />, {
      store,
    });

    const button = await screen.findByText(/Continue/i);

    userEvent.click(button);

    expect(screen.history.push.called).to.be.true;

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        'contact-information',
      ),
    );
  });
});
