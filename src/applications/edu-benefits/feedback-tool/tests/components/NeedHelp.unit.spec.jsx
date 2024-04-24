import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NeedHelp from '../../components/NeedHelp';

describe('<NeedHelp/>', () => {
  it('should render without issue', () => {
    const wrapper = shallow(<NeedHelp />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
