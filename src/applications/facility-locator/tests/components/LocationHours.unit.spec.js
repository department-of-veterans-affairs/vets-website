import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LocationHours from '../../components/LocationHours';

describe('LocatorHours Helper Method Tests', () => {
  it('.isLocationDataValid should return true if data is valid', () => {
    const location = {
      attributes: {
        facilityType: 'va_health_facility',
        hours: {
          monday: '800AM-430PM',
        },
      },
    };

    const wrapper = shallow(<LocationHours />);

    expect(wrapper.instance().isLocationDataValid(location)).to.eq(true);
    wrapper.unmount();
  });

  it('should return false if location in undefined', () => {
    const wrapper = shallow(<LocationHours />);

    expect(wrapper.instance().isLocationDataValid()).to.eq(false);
    wrapper.unmount();
  });

  it('.isLocationDataValid should return false if location has no hours and facilityType is not vet_center', () => {
    const location = {
      attributes: {
        facilityType: 'va_health_facility',
        hours: {},
      },
    };

    const wrapper = shallow(<LocationHours />);

    expect(wrapper.instance().isLocationDataValid(location)).to.eq(false);
    wrapper.unmount();
  });

  it('.isLocationDataValid should return true if location has hours', () => {
    const location = {
      attributes: {
        facilityType: 'va_center',
        hours: {
          monday: '800AM-430PM',
        },
      },
    };

    const wrapper = shallow(<LocationHours />);

    expect(wrapper.instance().isLocationDataValid(location)).to.eq(true);
    wrapper.unmount();
  });

  it('.formatTimeRange should convert API hour to a human readable hour', () => {
    const hour = '800AM-430PM';
    const expected = '8:00a.m. - 4:30p.m.';

    const wrapper = shallow(<LocationHours />);
    const result = wrapper.instance().formatTimeRange(hour);

    expect(result).to.eq(expected);
    wrapper.unmount();
  });

  it('.formatTimeRange should return "" is format is not valid', () => {
    const hour = '00AM-30PM';
    const expected = '';

    const wrapper = shallow(<LocationHours />);
    const result = wrapper.instance().formatTimeRange(hour);

    expect(result).to.eq(expected);
    wrapper.unmount();
  });

  it('.formatLocationHours should give back a object with converted hours', () => {
    const hours = {
      monday: '800AM-430PM',
      tuesday: '800AM-430PM',
      wednesday: '800AM-1200PM',
      thursday: '800AM-430PM',
      friday: '800AM-430PM',
      saturday: '-',
      sunday: '-',
    };

    const expected = {
      monday: '8:00a.m. - 4:30p.m.',
      tuesday: '8:00a.m. - 4:30p.m.',
      wednesday: '8:00a.m. - 12:00p.m.',
      thursday: '8:00a.m. - 4:30p.m.',
      friday: '8:00a.m. - 4:30p.m.',
      saturday: 'Closed',
      sunday: 'Closed',
    };

    const wrapper = shallow(<LocationHours />);
    const result = wrapper.instance().formatLocationHours(hours);

    expect(JSON.stringify(result)).to.eq(JSON.stringify(expected));
    wrapper.unmount();
  });

  it('.formatLocationHours should give back an object without the property of a malformed time', () => {
    const hours = {
      monday: '800AM-430PM',
      tuesday: '800AM-430PM',
      wednesday: '800AM-1200PM',
      thursday: '800AM-430PM',
      friday: '00AM-30PM',
      saturday: '-',
      sunday: '-',
    };

    const expected = {
      monday: '8:00a.m. - 4:30p.m.',
      tuesday: '8:00a.m. - 4:30p.m.',
      wednesday: '8:00a.m. - 12:00p.m.',
      thursday: '8:00a.m. - 4:30p.m.',
      saturday: 'Closed',
      sunday: 'Closed',
    };

    const wrapper = shallow(<LocationHours />);
    const result = wrapper.instance().formatLocationHours(hours);

    expect(JSON.stringify(result)).to.eq(JSON.stringify(expected));
    wrapper.unmount();
  });
});
