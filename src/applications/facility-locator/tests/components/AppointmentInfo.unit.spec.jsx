import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppointmentInfo from '../../components/AppointmentInfo';

describe('<AppointmentInfo>', () => {
  const testFacility = {
    id: 'vha_674BY',
    type: 'facility',
    attributes: {
      access: {
        health: [
          {
            service: 'Audiology',
            new: null,
            established: 0.5,
          },
          {
            service: 'Cardiology',
            new: null,
            established: 0,
          },
          {
            service: 'Dermatology',
            new: 6.894736,
            established: 8.363636,
          },
          {
            service: 'Gastroenterology',
            new: 3.5,
            established: null,
          },
          {
            service: 'Gynecology',
            new: null,
            established: 3.2,
          },
          {
            service: 'MentalHealthCare',
            new: 3.681818,
            established: 3.716911,
          },
          {
            service: 'Ophthalmology',
            new: 3.5,
            established: 4.175675,
          },
          {
            service: 'Optometry',
            new: 10.583333,
            established: 3.75,
          },
          {
            service: 'Orthopedics',
            new: 7.428571,
            established: 1.948717,
          },
          {
            service: 'PrimaryCare',
            new: 3.049382,
            established: 1.279856,
          },
          {
            service: 'SpecialtyCare',
            new: 5.80916,
            established: 4.679862,
          },
          {
            service: 'WomensHealth',
            new: null,
            established: 3.2,
          },
        ],
        effectiveDate: '2020-07-13',
      },
      feedback: {},
      id: 'vha_674BY',
      name: 'Austin VA Clinic',
      facilityType: 'va_health_facility',
    },
  };

  it('Should render access care component v1', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacility} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
