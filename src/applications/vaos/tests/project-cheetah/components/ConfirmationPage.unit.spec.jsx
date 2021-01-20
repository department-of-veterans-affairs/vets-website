import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPage from '../../../project-cheetah/components/ConfirmationPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingProjectCheetah: true,
  },
};

describe('VAOS vaccine flow <ConfirmationPage>', () => {
  it('should show confirmation details', async () => {
    const start = moment();
    const store = createTestStore({
      projectCheetah: {
        newBooking: {
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
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard'],
              },
            },
          ],
        },
      },
    });

    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    expect(await screen.findByText(/Your appointment is confirmed/i)).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;

    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');

    userEvent.click(screen.getByText(/View your appointments/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
  });

  it('should redirect to home page if no form data', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    // Expect router to route to home page
    await waitFor(() => {
      expect(screen.history.replace.firstCall.args[0]).to.equal('/');
    });
  });
});
