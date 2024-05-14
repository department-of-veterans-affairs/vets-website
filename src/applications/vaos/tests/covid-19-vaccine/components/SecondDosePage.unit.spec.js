import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/dom';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import SecondDosePage from '../../../covid-19-vaccine/components/SecondDosePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS vaccine flow: SecondDosePage', () => {
  const start = moment();
  const store = createTestStore({
    ...initialState,
    covid19Vaccine: {
      newBooking: {
        previousPages: {},
        data: {
          vaFacility: 'var983',
          clinicId: '455',
          date1: [start.format()],
        },
        availableSlots: [
          {
            start: start.format(),
            end: start
              .clone()
              .add(30, 'minutes')
              .format(),
          },
        ],
        clinics: {},
        facilities: [
          {
            id: 'var983',
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

    expect(
      await screen.getByText(/When to plan for a second dose/i),
    ).to.have.tagName('h1');

    expect(
      screen.getByText(
        new RegExp(`If you get your first dose of a 2-dose vaccine on`, 'i'),
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(`${start.clone().format('dddd, MMMM DD, YYYY')}`, 'i'),
      ),
    ).to.be.ok;
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
          `after ${start
            .clone()
            .add(21, 'days')
            .format('dddd, MMMM DD, YYYY')}`,
          'i',
        ),
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(
          `after ${start
            .clone()
            .add(28, 'days')
            .format('dddd, MMMM DD, YYYY')}`,
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
        '/new-covid-19-vaccine-appointment/contact-info',
      ),
    );
  });
});
