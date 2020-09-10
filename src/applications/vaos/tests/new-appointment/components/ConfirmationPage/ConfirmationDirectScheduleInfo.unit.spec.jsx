import React from 'react';
import ConfirmationDirectScheduleInfo from '../../../../new-appointment/components/ConfirmationPage/ConfirmationDirectScheduleInfo';
import reducers from '../../../../redux/reducer';
import { renderWithStoreAndRouter } from '../../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <ConfirmationDirectScheduleInfo>', () => {
  it('should render', () => {
    const props = {
      facilityDetails: {
        id: 'var983',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      },
      data: {
        phoneNumber: '1234567890',
        email: 'joeblow@gmail.com',
        reasonForAppointment: 'routine-follow-up',
        reasonAdditionalInfo: 'Additional info',
        calendarData: {
          selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
        },
      },
      systemId: '983',
      slot: {
        start: '2019-12-20T10:00:00',
        end: '2019-12-20T10:20:00',
      },
    };
    const pageTitle = 'Your appointment has been scheduled';

    const screen = renderWithStoreAndRouter(
      <ConfirmationDirectScheduleInfo {...props} pageTitle={pageTitle} />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment has been scheduled./i);
    screen.getByText(/December 20, 2019 at 10:00 a.m. MT/i);
    screen.getByText(/Cheyenne VA Medical Center/i);
    screen.getByText(/2360 East Pershing Boulevard/i);
    screen.getByText(/Cheyenne, WY 82001-5356/i);
    screen.getByText(/Follow-up\/Routine/i);
    screen.getByText(/Additional info/i);

    // Simulate user clicking the "Add to calendar" button
    screen.getByRole('link', {
      name: 'Add December 20, 2019 appointment to your calendar',
    });
  });
});
