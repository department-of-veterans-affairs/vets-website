import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import { FACILITY_TYPES, FLOW_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import {
  onCalendarChange,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
} from '../../../../new-appointment/redux/actions';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};
describe('VAOS <ReviewPage>', () => {
  it.only('should render direct schedule view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: 'var983',
          vaFacility: 'var983',
          clinicId: '455',
        },
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
        facilityDetails: {
          var983: {
            id: 'var983',
            name: 'Cheyenne VA Medical Center',
            address: {
              postalCode: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              line: ['2360 East Pershing Boulevard'],
            },
          },
        },
        clinics: {
          // eslint-disable-next-line camelcase
          var983_323: [
            {
              id: '455',
              serviceName: 'Some VA clinic',
            },
          ],
        },
        facilities: {
          '323_var983': [
            {
              id: 'var983',
              name: 'Cheyenne VA Medical Center',
            },
          ],
        },
      },
    });
    store.dispatch(startDirectScheduleFlow());
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format(),
        selectedDates: [
          {
            datetime: start.format(),
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/scheduling a primary care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      clinicHeading,
      reasonHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'scheduling a primary care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('VA Appointment');

    expect(dateHeading).to.contain.text(
      start.format('dddd, MMMM DD, YYYY [at] h:mm a'),
    );

    expect(clinicHeading).to.contain.text('Some VA clinic');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');

    expect(reasonHeading).to.contain.text('Follow-up/Routine');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');
  });

  it.only('should render VA request view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          facilityType: FACILITY_TYPES.VAMC,
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: 'var983',
          vaFacility: 'var983',
          visitType: 'telehealth',
        },
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
        facilityDetails: {
          var983: {
            id: 'var983',
            name: 'Cheyenne VA Medical Center',
            address: {
              postalCode: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              line: ['2360 East Pershing Boulevard'],
            },
          },
        },
        clinics: {},
        facilities: {
          '323_var983': [
            {
              id: 'var983',
              name: 'Cheyenne VA Medical Center',
            },
          ],
        },
      },
    });
    store.dispatch(startRequestAppointmentFlow());
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format('YYYY-MM-DD'),
        selectedDates: [
          {
            date: start.format('YYYY-MM-DD'),
            optionTime: 'AM',
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a primary care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      clinicHeading,
      reasonHeading,
      visitTypeHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a primary care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('VA Appointment');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(clinicHeading).to.contain.text('Cheyenne VA Medical Center');

    expect(reasonHeading).to.contain.text('Follow-up/Routine');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(visitTypeHeading).to.contain.text('How to be seen');
    expect(screen.baseElement).to.contain.text(
      'Telehealth (through VA Video Connect)',
    );

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');
  });

  it.only('should render Community Care request view', async () => {
    const start = moment();
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          facilityType: FACILITY_TYPES.COMMUNITY_CARE,
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonAdditionalInfo: 'I need an appt',
          communityCareSystemId: 'var983',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            practiceName: 'Community medical center',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              street: '123 big sky st',
              city: 'Bozeman',
              state: 'MT',
              postalCode: '59715',
            },
          },
        },
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
        facilityDetails: {},
        clinics: {},
        facilities: {},
      },
    });
    store.dispatch(startRequestAppointmentFlow(true));
    store.dispatch(
      onCalendarChange({
        currentlySelectedDate: start.format('YYYY-MM-DD'),
        selectedDates: [
          {
            date: start.format('YYYY-MM-DD'),
            optionTime: 'AM',
          },
        ],
      }),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a community care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      providerHeading,
      additionalHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a community care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('Community Care');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(providerHeading).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('Community medical center');
    expect(screen.baseElement).to.contain.text('Jane Doe');
    expect(screen.baseElement).to.contain.text('123 Big sky st');
    expect(screen.baseElement).to.contain.text('Bozeman, MT 59715');

    expect(additionalHeading).to.contain.text('Additional details');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');
    screen.debug();
  });
  // it('should render review view', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};

  //   const tree = shallow(<ReviewPage flowType={flowType} data={data} />);

  //   expect(tree.find('ReviewRequestInfo').exists()).to.be.true;
  //   expect(
  //     tree
  //       .find('LoadingButton')
  //       .children()
  //       .text(),
  //   ).to.equal('Request appointment');
  //   expect(document.title).contain('Review your appointment details');

  //   tree.unmount();
  // });

  // it('should render submit loading state', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};

  //   const tree = shallow(
  //     <ReviewPage
  //       submitStatus={FETCH_STATUS.loading}
  //       flowType={flowType}
  //       data={data}
  //     />,
  //   );

  //   expect(tree.find('LoadingButton').props().isLoading).to.be.true;

  //   tree.unmount();
  // });

  // it('should render submit error state', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};

  //   const tree = shallow(
  //     <ReviewPage
  //       submitStatus={FETCH_STATUS.failed}
  //       flowType={flowType}
  //       data={data}
  //     />,
  //   );

  //   expect(tree.find('LoadingButton').props().isLoading).to.be.false;
  //   expect(tree.find('AlertBox').props().status).to.equal('error');

  //   tree.unmount();
  // });

  // it('should render submit error with facility', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};

  //   const tree = shallow(
  //     <ReviewPage
  //       submitStatus={FETCH_STATUS.failed}
  //       flowType={flowType}
  //       data={data}
  //       facilityDetails={{}}
  //     />,
  //   );
  //   const alertBox = tree.find('AlertBox');

  //   expect(tree.find('LoadingButton').props().isLoading).to.be.false;
  //   expect(alertBox.props().status).to.equal('error');
  //   expect(
  //     alertBox
  //       .dive()
  //       .find('FacilityAddress')
  //       .exists(),
  //   ).to.be.true;
  //   expect(alertBox.dive().text()).contain(
  //     'We suggest you wait a day to try again or you can call your medical center',
  //   );
  //   tree.unmount();
  // });

  // it('should render 400 error with facility', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};

  //   const tree = shallow(
  //     <ReviewPage
  //       submitStatus={FETCH_STATUS.failed}
  //       submitStatusVaos400
  //       flowType={flowType}
  //       data={data}
  //       facilityDetails={{}}
  //     />,
  //   );
  //   const alertBox = tree.find('AlertBox');

  //   expect(tree.find('LoadingButton').props().isLoading).to.be.false;
  //   expect(alertBox.props().status).to.equal('error');
  //   expect(
  //     alertBox
  //       .dive()
  //       .find('FacilityAddress')
  //       .exists(),
  //   ).to.be.true;
  //   expect(alertBox.dive().text()).contain(
  //     'You’ll need to call your local VA medical center',
  //   );
  //   tree.unmount();
  // });

  // it('return to new appt page when data is empty', () => {
  //   const flowType = FLOW_TYPES.REQUEST;
  //   const data = {};
  //   const history = {
  //     replace: sinon.spy(),
  //   };

  //   const tree = mount(
  //     <ReviewPage flowType={flowType} data={data} history={history} />,
  //   );

  //   expect(history.replace.called).to.be.true;

  //   tree.unmount();
  // });
});
