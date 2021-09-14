import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import OnlineClassesFilter from '../../../components/search/OnlineClassesFilter';

describe('<OnlineClassesFilter/>', () => {
  it('should render', () => {
    const wrapper = shallow(<OnlineClassesFilter />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
