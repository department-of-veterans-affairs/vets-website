import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LearnMoreLabel from '../../components/LearnMoreLabel';

describe('<LearnMoreLabel/>', () => {
  it('should render', () => {
    const wrapper = shallow(<LearnMoreLabel />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
