import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AlertBox from '../../components/AlertBox';

describe('<AlertBox>', () => {
  it('it should render', () => {
    const currentProps = {
      isVisible: true,
      content: 'Previous content',
      status: 'active',
    };

    const nextProps = {
      isVisible: false,
      content: 'New content',
      status: 'inactive',
    };

    const wrapper = shallow(<AlertBox {...currentProps} />);
    expect(wrapper.instance().shouldComponentUpdate(nextProps)).to.be.true;
    wrapper.setProps(nextProps);
    expect(wrapper.instance().shouldComponentUpdate(nextProps)).to.be.false;
    wrapper.unmount();
  });
});
