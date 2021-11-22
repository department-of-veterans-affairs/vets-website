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
    tree.find('.right-arrow i').simulate('click');
    expect(clickHandler.called).to.be.true;
    expect(clickHandler.args[0][0]).to.eq(50);
    tree.unmount();
  });
});
