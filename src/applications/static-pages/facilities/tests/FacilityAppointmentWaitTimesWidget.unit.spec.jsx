import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';
import { FacilityAppointmentWaitTimesWidget } from '../FacilityAppointmentWaitTimesWidget';

describe('facilities <FacilityAppointmentWaitTimesWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(<FacilityAppointmentWaitTimesWidget loading />);

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render new and existing patient appointment wait time data for primary care service', () => {
    const tree = shallow(
      <FacilityAppointmentWaitTimesWidget
        loading={false}
        facility={mockFacilityLocatorApiResponse.data[0]}
        service="PrimaryCare"
      />,
    );

    expect(tree.find('va-loading-indicator').exists()).to.be.false;

    const appointmentWaitTimesHeader = tree.find('h4');
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

  it('should render new and existing patient appointment wait time data for mental health care service', () => {
    const tree = shallow(
      <FacilityAppointmentWaitTimesWidget
        loading={false}
        facility={mockFacilityLocatorApiResponse.data[0]}
        service="MentalHealthCare"
      />,
    );

    const newPatientWaitTime = tree.find(
      '#facility-mentalhealthcare-new-patient-wait-time',
    );
    expect(newPatientWaitTime.text()).to.contain('6 days');

    const existingPatientWaitTime = tree.find(
      '#facility-mentalhealthcare-existing-patient-wait-time',
    );
    expect(existingPatientWaitTime.text()).to.contain('7 days');

    tree.unmount();
  });

  it('should NOT render facility patient satisfaction score data', () => {
    const testNoFeedbackData = {
      attributes: { feedback: { health: {} } },
    };

    const tree = shallow(
      <FacilityAppointmentWaitTimesWidget
        loading={false}
        facility={testNoFeedbackData}
        service="PrimaryCare"
      />,
    );

    expect(tree).to.be.empty;

    tree.unmount();
  });
});
