import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationDistance from '../../../components/search-results-items/common/LocationDistance';

describe('LocationDistance', () => {
  it('renders distance with a marker', () => {
    const wrapper = shallow(
      <LocationDistance distance={42.1} markerText={'foo'} />,
    );

    expect(wrapper.find('.i-pin-card-map').text()).to.equal('foo');
    expect(wrapper.find('.vads-u-margin-left--1').text()).to.equal(
      '42.1 miles',
    );

    wrapper.unmount();
  });

  it('renders distance without marker if no markerText', () => {
    const wrapper = shallow(<LocationDistance distance={42.1} />);

    expect(wrapper.find('.i-pin-card-map').length).to.equal(0);
    expect(wrapper.find('.vads-u-margin-left--1').text()).to.equal(
      '42.1 miles',
    );

    wrapper.unmount();
  });

  it('renders nothing if distance is not provided', () => {
    const wrapper = shallow(<LocationDistance markerText={'foo'} />);

    expect(wrapper.html()).to.be.null;

    wrapper.unmount();
  });

  it('renders nothing if neither distance nor marketText is provided', () => {
    const wrapper = shallow(<LocationDistance />);

    expect(wrapper.html()).to.be.null;

    wrapper.unmount();
  });
});
