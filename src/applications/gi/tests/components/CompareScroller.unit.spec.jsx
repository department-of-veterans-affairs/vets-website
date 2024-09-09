import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CompareScroller from '../../components/CompareScroller';

describe('<CompareScroller>', () => {
  it('should render', () => {
    const tree = shallow(<CompareScroller />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should increment by divisionWidth', () => {
    const clickHandler = sinon.spy();
    const tree = shallow(
      <CompareScroller
        currentScroll={20}
        onClick={clickHandler}
        divisions={10}
        divisionWidth={10}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.find('.right-arrow va-icon').simulate('click');
    expect(clickHandler.called).to.be.true;
    expect(clickHandler.args[0][0]).to.eq(50);
    tree.unmount();
  });
  it('renders the component with the correct structure', () => {
    const divisions = 3;
    const divisionWidth = 100;
    const currentScroll = 50;

    const wrapper = shallow(
      <CompareScroller
        divisions={divisions}
        divisionWidth={divisionWidth}
        currentScroll={currentScroll}
      />,
    );

    expect(wrapper.find('.compare-scroller')).to.have.lengthOf(1);
    expect(wrapper.find('.scroll-controls')).to.have.lengthOf(1);
    expect(wrapper.find('.left-arrow')).to.have.lengthOf(1);
    expect(wrapper.find('.circles')).to.have.lengthOf(1);
    expect(wrapper.find('.right-arrow')).to.have.lengthOf(1);
    expect(wrapper.find('.gi-compare-circle')).to.have.lengthOf(divisions);

    const leftArrow = wrapper.find('.left-arrow');
    leftArrow.find('va-icon').simulate('click');
    const rightArrow = wrapper.find('.right-arrow');
    rightArrow.find('va-icon').simulate('click');
    wrapper.unmount();
  });
});
