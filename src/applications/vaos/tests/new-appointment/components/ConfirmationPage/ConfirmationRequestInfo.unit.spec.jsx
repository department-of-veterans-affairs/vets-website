import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import ConfirmationRequestInfo from '../../../../new-appointment/components/ConfirmationPage/ConfirmationRequestInfo';
import reducers from '../../../../redux/reducer';
import { renderWithStoreAndRouter } from '../../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <ConfirmationRequestInfo>', () => {
  it('should render VA request', () => {
    const data = {
      typeOfCareId: '323',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const screen = renderWithStoreAndRouter(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment request has been submitted./i);
    screen.getByText(/VA appointment/i);
    screen.getByText(/Primary care appointment/i);
    screen.getByText(/Pending/i);
    screen.getByText(/CHYSHR-Sidney VA Clinic/i);
    screen.getByText(/Cheyenne, WY/i);
    screen.getByText(/December 20, 2019 in the morning/i);
  });

  it('should render CC request', () => {
    const data = {
      typeOfCareId: '323',
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: true,
      communityCareProvider: {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const pageTitle = 'Your appointment request has been submitted';
    const screen = renderWithStoreAndRouter(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        vaCityState="Cheyenne, WY"
        pageTitle={pageTitle}
      />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment request has been submitted./i);
    screen.getByText(/Community Care/i);
    screen.getByText(/Primary care appointment/i);
    screen.getByText(/Pending/i);
    screen.getByText(/Jane Doe/i);
    screen.getByText(/555555555/i);
    screen.getByText(/123 Test/i);
    screen.getByText(/Northampton, MA 01060/i);
    screen.getByText(/December 20, 2019 in the morning/i);
  });

  it('should render CC request without provider', () => {
    const data = {
      typeOfCareId: '323',
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: false,
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const pageTitle = 'Your appointment request has been submitted';
    const screen = renderWithStoreAndRouter(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        vaCityState="Cheyenne, WY"
        pageTitle={pageTitle}
      />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment request has been submitted./i);
    screen.getByText(/Community Care/i);
    screen.getByText(/Primary care appointment/i);
    screen.getByText(/Pending/i);
    screen.getByText(/No preference/i);

    expect(screen.queryByText(/CHYSHR-Sidney VA Clinic/i)).to.be.null;
  });

  it('should render single time', () => {
    const data = {
      phoneNumber: '1234567890',
      email: 'joeblow@gmail.com',
      reasonForAppointment: 'routine-follow-up',
      reasonAdditionalInfo: 'Additional info',
      visitType: 'office',
      bestTimeToCall: {
        evening: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const screen = renderWithStoreAndRouter(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
      {
        initialState,
        reducers,
      },
    );

    // Simulate user clicking the "Show more" button
    const button = screen.getByRole('button', { name: 'Show more' });
    userEvent.click(button);

    // Button text should change to "Show less"
    screen.getByRole('button', { name: 'Show less' });

    // The following additional information should be displayed
    screen.getByText(/Follow-up\/Routine/i);
    screen.getByText(/Additional info/i);
    screen.getByText(/joeblow@gmail.com/i);
    screen.getByText(/1234567890/i);
    screen.getByText(/Evening/i);
  });

  it('should render message for all times', () => {
    const data = {
      phoneNumber: '1234567890',
      email: 'joeblow@gmail.com',
      reasonForAppointment: 'routine-follow-up',
      reasonAdditionalInfo: 'Additional info',
      visitType: 'office',
      bestTimeToCall: {
        evening: true,
        morning: true,
        afternoon: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const screen = renderWithStoreAndRouter(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
      {
        initialState,
        reducers,
      },
    );

    // Simulate user clicking the "Show more" button
    const button = screen.getByRole('button', { name: 'Show more' });
    userEvent.click(button);

    // Button text should change to "Show less"
    screen.getByRole('button', { name: 'Show less' });

    // The following additional information should be displayed
    screen.getByText(/Follow-up\/Routine/i);
    screen.getByText(/Additional info/i);
    screen.getByText(/joeblow@gmail.com/i);
    screen.getByText(/1234567890/i);
    screen.getByText(/Anytime during the day/i);
  });
});
