import React from 'react';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchControls from '../../components/SearchControls';
import { benefitsServices } from '../../config';

describe('SearchControls', () => {
  it('Should render search controls with Choose a facility type by default', () => {
    const query = {
      facilityType: null,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(
      wrapper
        .render()
        .find('#facility-type-dropdown [selected]')
        .text(),
    ).to.equal('Choose a facility type');
    expect(
      wrapper
        .find('label')
        .find('span')
        .at(0)
        .text(),
    ).to.equal('(*Required)');
    expect(
      wrapper
        .find('label')
        .find('span')
        .at(1)
        .text(),
    ).to.equal('(*Required)');
    wrapper.unmount();
  });

  it('Should render search controls with VA benefits facility selected', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(
      wrapper
        .render()
        .find('#facility-type-dropdown [selected]')
        .val(),
    ).to.equal(query.facilityType);
    expect(
      wrapper
        .render()
        .find('#facility-type-dropdown [selected]')
        .text(),
    ).to.equal('VA benefits');

    wrapper.unmount();
  });

  it('Should render search controls with VA benefits its services options', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    const servicesList = wrapper.find('#service-type-dropdown').find('option');
    const benefits = Object.values(benefitsServices);
    servicesList.forEach((val, idx) =>
      expect(val.text()).to.equal(benefits[idx]),
    );
    wrapper.unmount();
  });

  it('Shows modal error message if geocodeError is truthy', () => {
    const query = {
      geocodeError: 1,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(wrapper.find('Modal').prop('visible')).to.equal(1);
    wrapper.unmount();
  });

  it('Does not show modal error message if geocodeError is falsy', () => {
    const query = {
      geocodeError: 0,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(wrapper.find('Modal').prop('visible')).to.equal(0);
    wrapper.unmount();
  });
});
