import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';
import { FacilityAppointmentWaitTimesWidget } from '../../facilities/FacilityAppointmentWaitTimesWidget';

describe('facilities <FacilityAppointmentWaitTimesWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(<FacilityAppointmentWaitTimesWidget loading />);

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility patient satisfaction score data', () => {
    const tree = shallow(
      <FacilityAppointmentWaitTimesWidget
        loading={false}
        facility={mockFacilityLocatorApiResponse.data[0]}
        service="Primary Care"
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;

    const appointmentWaitTimesHeader = tree.find('h3');
    expect(appointmentWaitTimesHeader.text()).to.contain(
      'Average number of days to get an appointment',
    );

    const facilityAppointmentWaitTimesEffectiveDate = tree.find(
      '#facility-primaryCare-appointment-wait-times-effective-date',
    );
    expect(facilityAppointmentWaitTimesEffectiveDate.text()).to.contain(
      'Current as of April 22, 2019',
    );

    const newPatientWaitTime = tree.find(
      '#facility-primaryCare-new-patient-wait-time',
    );
    expect(newPatientWaitTime.text()).to.contain('25 days');

    const existingPatientWaitTime = tree.find(
      '#facility-primaryCare-existing-patient-wait-time',
    );
    expect(existingPatientWaitTime.text()).to.contain('8 days');

    tree.unmount();
  });
});
