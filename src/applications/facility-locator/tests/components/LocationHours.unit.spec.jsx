import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LocationHours from '../../components/LocationHours';

describe('<LocationHours>', () => {
  const makeTestFacility = (
    operationalHoursSpecialInstructions,
    facilityType,
  ) => ({
    id: 'vha_549',
    type: 'facility',
    attributes: {
      facilityType,
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
      operationalHoursSpecialInstructions,
      uniqueId: '549',
      visn: '17',
      website: 'https://www.northtexas.va.gov/locations/directions.asp',
    },
  });

  const operationalHoursSpecialInstructions =
    'Administrative hours are Monday-Friday 8:00 a.m. to 4:30 p.m. | Expanded or Nontraditional hours are available for some services on a ' +
    'routine and or requested basis. Please call our main phone number for details. |';

  it('Should render LocationHours with operationalHoursSpecialInstructions field with truthy values', () => {
    const wrapper = shallow(
      <LocationHours
        location={makeTestFacility(
          operationalHoursSpecialInstructions,
          'va_health_facility',
        )}
        showHoursSpecialInstructions
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
        location={makeTestFacility(
          operationalHoursSpecialInstructions,
          'va_health_facility',
        )}
        showHoursSpecialInstructions={false}
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render LocationHours without operationalHoursSpecialInstructions field - operationalHoursSpecialInstructions null', () => {
    const wrapper = shallow(
      <LocationHours
        location={makeTestFacility(null, operationalHoursSpecialInstructions)}
        showHoursSpecialInstructions
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render LocationHours without operationalHoursSpecialInstructions field with no VA facilities', () => {
    const wrapper = shallow(
      <LocationHours
        location={makeTestFacility(
          operationalHoursSpecialInstructions,
          'facility_other_type',
        )}
        showHoursSpecialInstructions
      />,
    );
    expect(wrapper.find('#operational-special-p').length).to.equal(0);
    wrapper.unmount();
  });
});
