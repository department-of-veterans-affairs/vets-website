import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarWidget from '../../../components/calendar/CalendarWidget';
import { FETCH_STATUS } from '../../../utils/constants';

describe('VAOS <CalendarWidget>', () => {
  it('should render 2 calendars', () => {
    const tree = shallow(<CalendarWidget monthsToShowAtOnce={2} />);
    const cell = tree.find('.vaos-calendar__container');
    expect(cell.length).to.equal(2);
    const navigation = tree.find('CalendarNavigation');
    expect(navigation.length).to.equal(1);
    const weekdayHeaders = tree.find('CalendarWeekdayHeader');
    expect(weekdayHeaders.length).to.equal(2);
    tree.unmount();
  });

  it('should render loading indicator if loadingStatus === "loading"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.loading}
      />,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render loading indicator if loadingStatus === "succeeded"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.succeeded}
      />,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    tree.unmount();
  });

  it('should not render calendar if loadingStatus === "failed"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.failed}
      />,
    );
    expect(tree.text()).to.contain(
      'There was a problem loading appointment availability. Please try again later.',
    );
    tree.unmount();
  });

  it('should still render a calendar if startMonth is beyond 90 day default', () => {
    const tree = shallow(
      <CalendarWidget monthsToShowAtOnce={2} startMonth="2020-11-20" />,
    );
    const cell = tree.find('.vaos-calendar__container');
    expect(cell.length).to.equal(1);
    const navigation = tree.find('CalendarNavigation');
    expect(navigation.length).to.equal(1);
    const weekdayHeaders = tree.find('CalendarWeekdayHeader');
    expect(weekdayHeaders.length).to.equal(1);
    tree.unmount();
  });

  it('should display the same month as startMonth', () => {
    const tree = shallow(
      <CalendarWidget monthsToShowAtOnce={2} startMonth="2019-11-20" />,
    );

    expect(
      tree
        .find('h2')
        .at(0)
        .text(),
    ).to.equal('November 2019');

    tree.unmount();
  });
});
