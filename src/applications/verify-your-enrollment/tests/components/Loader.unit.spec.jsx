import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Loader from '../../components/Loader';

describe('<Loader/>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
