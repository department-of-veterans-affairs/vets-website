import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import SecondDosePage from '../../../project-cheetah/components/SecondDosePage';
import { waitFor } from '@testing-library/dom';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS vaccine flow <SecondDosePage>', () => {
  const start = moment();
  const store = createTestStore({
    ...initialState,
    projectCheetah: {
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
      await screen.getByText(/When to expect a second dose/i),
    ).to.have.tagName('h1');
    expect(
      screen.getByText(
        /You may need to return to the Cheyenne VA Medical Center/i,
      ),
    ).to.be.ok;
    expect(screen.getByText('Moderna')).to.have.tagName('h2');
    expect(screen.getByText('Pfizer')).to.have.tagName('h2');
    expect(screen.getByText('Johnson & Johnson')).to.have.tagName('h2');
    expect(screen.baseElement).to.contain.text(
      `If you receive your first dose on ${start.format(
        'dddd, MMMM DD, YYYY',
      )}`,
    );
    expect(
      screen.getByText(
        new RegExp(
          `Plan to return after ${start
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
          `Plan to return after ${start
            .clone()
            .add(28, 'days')
            .format('dddd, MMMM DD, YYYY')}`,
          'i',
        ),
      ),
    ).to.be.ok;
    // Johnson & Johnson
    expect(screen.getByText('1 dose only')).to.be.ok;
  });

  xit('should show additional message after user clicks the expand link', async () => {
    const screen = renderWithStoreAndRouter(<SecondDosePage />, {
      store,
    });
    userEvent.click(screen.getByText(/Can I choose which vaccine I will get/i));
    expect(await screen.getByText(/Not at this time/i)).to.be.ok;
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
        '/new-covid-19-vaccine-booking/contact-info',
      ),
    );
  });
});
