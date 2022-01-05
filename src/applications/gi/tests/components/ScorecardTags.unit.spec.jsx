import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ScorecardTags from '../../components/ScorecardTags';

describe('<ScorecardTags/>', () => {
  it('should render', () => {
    const wrapper = shallow(<ScorecardTags />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
