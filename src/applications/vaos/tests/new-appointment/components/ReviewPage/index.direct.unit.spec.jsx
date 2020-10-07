import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import { FACILITY_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import {
  onCalendarChange,
  startDirectScheduleFlow,
} from '../../../../new-appointment/redux/actions';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};
const parentFacilities = [
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
];
const facilityDetails = {
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
};
const facilities = {
  '323_var983': [
    {
      id: 'var983',
      name: 'Cheyenne VA Medical Center',
    },
  ],
};

describe('VAOS <ReviewPage> direct scheduling', () => {
  it('should show form information for review', async () => {
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
        parentFacilities,
        facilityDetails,
        facilities,
        clinics: {
          // eslint-disable-next-line camelcase
          var983_323: [
            {
              id: '455',
              serviceName: 'Some VA clinic',
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

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });
  it('should submit an appointment', () => {});
  it('should show error if submit fails', () => {});
  it('should submit CC request', () => {});
  it('should submit VA request', () => {});
  it('should remove try again language if submit fails with bad request error', () => {});
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
