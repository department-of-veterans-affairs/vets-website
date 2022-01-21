import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Modal from '../../components/Modal';

describe('<Modal/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Modal />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
