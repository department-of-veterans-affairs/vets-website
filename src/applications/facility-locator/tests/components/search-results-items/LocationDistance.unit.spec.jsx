import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationDistance from '../../../components/search-results-items/common/LocationDistance';

describe('LocationDistance', () => {
  it('renders the distance', () => {
    const wrapper = shallow(<LocationDistance distance={1.56} />);

    expect(wrapper.find('[data-testid="fl-results-distance"]').text()).to.equal(
      '1.6 miles',
    );

    wrapper.unmount();
  });

  it('renders nothing if distance is not provided', () => {
    const wrapper = shallow(<LocationDistance />);

    expect(wrapper.html()).to.be.null;

    wrapper.unmount();
  });
});
