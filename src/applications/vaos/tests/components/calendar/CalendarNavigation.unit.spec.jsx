import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CalendarNavigation from '../../../components/calendar/CalendarNavigation';

describe('VAOS <CalendarNavigation>', () => {
  it('should prev and next buttons', () => {
    const tree = shallow(<CalendarNavigation />);
    const items = tree.find('button');
    expect(items.length).to.equal(2);
    expect(items.at(0).text()).to.equal('Previous');
    expect(items.at(1).text()).to.equal('Next');
    tree.unmount();
  });

  it('should disable buttons if disabled props are passed', () => {
    const tree = shallow(<CalendarNavigation prevDisabled nextDisabled />);
    const items = tree.find('button');
    expect(items.at(0).props().disabled).to.equal(true);
    expect(items.at(1).props().disabled).to.equal(true);
    tree.unmount();
  });

  it('should handle clicks if prevOnClick or nextOnClick props are passed', () => {
    const prevOnClick = sinon.spy();
    const nextOnClick = sinon.spy();
    const tree = shallow(
      <CalendarNavigation
        prevOnClick={prevOnClick}
        nextOnClick={nextOnClick}
      />,
    );
    const items = tree.find('button');
    items.at(0).simulate('click');
    expect(prevOnClick.calledOnce).to.be.true;
    items.at(1).simulate('click');
    expect(nextOnClick.calledOnce).to.be.true;
    tree.unmount();
  });

  it('test CSS class added to button', () => {
    const tree = shallow(<CalendarNavigation />);
    const items = tree.find('button.vaos-calendar__nav-links-button');
    expect(items).to.have.lengthOf(2);
    tree.unmount();
  });
});
