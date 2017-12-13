import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Expander from '../../../../src/js/claims-status/components/appeals-v2/Expander';

describe('<Expander/>', () => {
  const defaultProps = {
    dateRange: 'June 5, 1985 - July 29, 2017',
    onToggle: () => {},
    cssClass: 'section-unexpanded',
    expanded: false
  };

  it('should render as an <li/>', () => {
    const wrapper = shallow(<Expander {...defaultProps}/>);
    expect(wrapper.type()).to.equal('li');
  });

  it('should render a button that calls onToggle prop when clicked', () => {
    const toggleSpy = sinon.spy();
    const props = {
      ...defaultProps,
      onToggle: toggleSpy
    };
    const wrapper = shallow(<Expander {...props}/>);
    const toggleButton = wrapper.find('button');
    toggleButton.simulate('click');
    expect(toggleSpy.calledOnce).to.be.true;
  });
});
