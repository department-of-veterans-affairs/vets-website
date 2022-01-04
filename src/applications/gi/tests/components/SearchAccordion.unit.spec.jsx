import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchAccordion from '../../components/SearchAccordion';

describe('<SearchAccordion/>', () => {
  it('should render', () => {
    const wrapper = shallow(<SearchAccordion />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
