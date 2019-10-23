import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

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
});
