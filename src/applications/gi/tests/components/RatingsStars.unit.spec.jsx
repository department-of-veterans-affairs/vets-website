import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import RatingsStars from '../../components/RatingsStars';

describe('<RatingsStars/>', () => {
  it('should render', () => {
    const wrapper = shallow(<RatingsStars />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
