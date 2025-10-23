import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GIBillHeaderInfo from '../../components/GIBillHeaderInfo';

describe('<GIBillHeaderInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<GIBillHeaderInfo />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
