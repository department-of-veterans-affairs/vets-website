import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppointmentInfo from '../../components/AppointmentInfo';
import testFacilityV0 from '../../constants/mock-facility-v0.json';
import testFacilityV1 from '../../constants/mock-facility-v1.json';

describe('<AppointmentInfo>', () => {
  it('Should render appointment info component v0', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV0} />);
    expect(
      wrapper
        .find('h4')
        .at(0)
        .text(),
    ).to.equal('Appointments');
    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.equal('Current as of July 20, 2020');
    expect(
      wrapper
        .find('h4')
        .at(1)
        .text(),
    ).to.equal('New patient wait times');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.equal(
      'The average number of days a Veteran who hasn’t been to this location has to wait for a non-urgent appointment',
    );
    expect(wrapper.find('ul').length).to.equal(4);
    const primaryList = wrapper
      .find('ul')
      .find('li')
      .at(0);
    expect(primaryList.text()).to.equal('Primary Care: 4 days');
    const specialtyList = wrapper
      .find('ul')
      .at(0)
      .find('li')
      .at(1);
    expect(specialtyList.text()).to.equal(
      'Specialty care:Dermatology: 7 daysGastroenterology: 4 daysMental Health Care: 2 daysOphthalmology: 5 daysOptometry: 9 daysOrthopedics: 9 daysSpecialty Care: 6 days',
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('Should render appointment info  v1', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV1} />);
    expect(wrapper.type()).to.not.equal(null);
    expect(
      wrapper
        .find('h4')
        .at(0)
        .text(),
    ).to.equal('Appointments');
    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.equal('Current as of July 20, 2020');
    expect(
      wrapper
        .find('h4')
        .at(1)
        .text(),
    ).to.equal('New patient wait times');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.equal(
      'The average number of days a Veteran who hasn’t been to this location has to wait for a non-urgent appointment',
    );
    expect(wrapper.find('ul').length).to.equal(4);
    const primaryList = wrapper
      .find('ul')
      .find('li')
      .at(0);
    expect(primaryList.text()).to.equal('Primary Care: 4 days');
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
