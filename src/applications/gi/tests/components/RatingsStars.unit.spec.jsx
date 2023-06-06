import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import RatingsStars from '../../components/profile/schoolRatings/RatingsStars';

describe('<RatingsStars/>', () => {
  it('should render', () => {
    const wrapper = shallow(<RatingsStars />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
