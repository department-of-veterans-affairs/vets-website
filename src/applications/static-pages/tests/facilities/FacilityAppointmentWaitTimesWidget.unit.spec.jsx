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
        service="PrimaryCare"
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;

    const appointmentWaitTimesHeader = tree.find('h3');
    expect(appointmentWaitTimesHeader.text()).to.contain(
      'Average number of days to get an appointment',
    );

    const facilityAppointmentWaitTimesEffectiveDate = tree.find(
      '#facility-primarycare-appointment-wait-times-effective-date',
    );
    expect(facilityAppointmentWaitTimesEffectiveDate.text()).to.contain(
      'Current as of July 27, 2020',
    );

    const newPatientWaitTime = tree.find(
      '#facility-primarycare-new-patient-wait-time',
    );
    expect(newPatientWaitTime.text()).to.contain('4 days');

    const existingPatientWaitTime = tree.find(
      '#facility-primarycare-existing-patient-wait-time',
    );
    expect(existingPatientWaitTime.text()).to.contain('3 days');

    tree.unmount();
  });
});
