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

  it('Shows modal error message if geocodeError is 1 (permission denied)', () => {
    const query = {
      geocodeError: 1,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    const modal = wrapper.find('ForwardRef(VaModal)');
    expect(modal.prop('visible')).to.be.true;
    expect(modal.prop('modalTitle')).to.equal('We need to use your location');
    expect(
      modal
        .dive()
        .find('p')
        .text(),
    ).to.equal(
      'Please enable location sharing in your browser to use this feature.',
    );
    wrapper.unmount();
  });

  it('Shows modal error message if geocodeError is > 1', () => {
    const query = {
      geocodeError: 2,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    const modal = wrapper.find('ForwardRef(VaModal)');
    expect(modal.prop('visible')).to.be.true;
    expect(modal.prop('modalTitle')).to.equal("We couldn't locate you");
    expect(
      modal
        .dive()
        .find('p')
        .text(),
    ).to.equal(
      'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
    );
    wrapper.unmount();
  });

  it('Does not show modal error message if geocodeError is 0', () => {
    const query = {
      geocodeError: 0,
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(wrapper.find('ForwardRef(VaModal)').prop('visible')).to.be.false;
    wrapper.unmount();
  });
});
