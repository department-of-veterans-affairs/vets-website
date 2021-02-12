import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LocationHours from '../../components/LocationHours';

describe('<LocationHours>', () => {
  const testFacility = {
    id: 'vha_549',
    type: 'facility',
    attributes: {
      facilityType: 'va_health_facility',
      activeStatus: 'A',
      mobile: false,
      name: 'Dallas VA Medical Center',
      operatingStatus: {
        code: 'NORMAL',
      },
      hours: {
        monday: '24/7',
        tuesday: '24/7',
        wednesday: '24/7',
        thursday: '24/7',
        friday: '24/7',
        saturday: '24/7',
        sunday: '24/7',
      },
      operationalHoursSpecialInstructions:
        'Administrative hours are Monday-Friday 8:00 a.m. to 4:30 p.m. | Expanded or Nontraditional hours are available for some services on a routine and or requested basis. Please call our main phone number for details. |',
      uniqueId: '549',
      visn: '17',
      website: 'https://www.northtexas.va.gov/locations/directions.asp',
    },
  };

  const { operationalHoursSpecialInstructions } = testFacility.attributes;

  it('Should render LocationHours with operationalHoursSpecialInstructions field with truthy values', () => {
    const wrapper = shallow(
      <LocationHours
        location={testFacility}
        showHoursSpecialInstructions={!!operationalHoursSpecialInstructions}
      />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(
      wrapper
        .render()
        .find('#operational-special-p')
        .text(),
    ).to.equal(operationalHoursSpecialInstructions);
    wrapper.unmount();
  });

  it('Should render LocationHours without operationalHoursSpecialInstructions field - showHoursSpecialInstructions false', () => {
    const wrapper = shallow(
      <LocationHours
        location={testFacility}
        showHoursSpecialInstructions={!operationalHoursSpecialInstructions}
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render LocationHours without operationalHoursSpecialInstructions field - operationalHoursSpecialInstructions null', () => {
    testFacility.attributes.operationalHoursSpecialInstructions = null;
    const wrapper = shallow(
      <LocationHours
        location={testFacility}
        showHoursSpecialInstructions={!!operationalHoursSpecialInstructions}
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render LocationHours without operationalHoursSpecialInstructions field with no VA facilities', () => {
    testFacility.attributes.facilityType = 'other_facility';
    const wrapper = shallow(
      <LocationHours
        location={testFacility}
        showHoursSpecialInstructions={!!operationalHoursSpecialInstructions}
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });
});
