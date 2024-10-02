import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationMarker from '../../../components/search-results-items/common/LocationMarker';

describe('LocationMarker', () => {
  it('renders a marker', () => {
    const wrapper = shallow(<LocationMarker markerText={3} />);

    expect(wrapper.find('.i-pin-card-map').text()).to.equal('3');

    wrapper.unmount();
  });

  it('renders nothing if markerText is not provided', () => {
    const wrapper = shallow(<LocationMarker />);

    expect(wrapper.html()).to.be.null;

    wrapper.unmount();
  });
});
