import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';
import ScoEventsWidget from '../ScoEventsWidget';

describe('<ScoEventsWidget>', () => {
  it('renders correctly', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const scoEvents = [
      {
        name: 'Test Event',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: today,
        displayStartDate: today,
      },
    ];

    const wrapper = mount(<ScoEventsWidget scoEvents={scoEvents} />);
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('does not display events before their displayStartDate', () => {
    const tomorrow = moment()
      .startOf('day')
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const scoEvents = [
      {
        name: 'Test Event',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: tomorrow,
        displayStartDate: tomorrow,
      },
    ];

    const wrapper = mount(<ScoEventsWidget scoEvents={scoEvents} />);
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('does not display events past their eventEndDate', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const yesterday = moment(today)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const twoDaysAgo = moment(today)
      .subtract(2, 'day')
      .format('YYYY-MM-DD');
    const scoEvents = [
      {
        name: 'Test Event',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: twoDaysAgo,
        displayStartDate: twoDaysAgo,
        eventEndDate: yesterday,
      },
    ];

    const wrapper = mount(<ScoEventsWidget scoEvents={scoEvents} />);
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('does not display events past their default eventEndDate', () => {
    const yesterday = moment()
      .startOf('day')
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const scoEvents = [
      {
        name: 'Test Event',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: yesterday,
        displayStartDate: yesterday,
      },
    ];

    const wrapper = mount(<ScoEventsWidget scoEvents={scoEvents} />);
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('orders events by eventStartDate', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const tomorrow = moment(today)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const twoDaysAhead = moment(today)
      .add(2, 'day')
      .format('YYYY-MM-DD');
    const scoEvents = [
      {
        name: 'Test Event 1',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: tomorrow,
        displayStartDate: today,
      },
      {
        name: 'Test Event 2',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: today,
        displayStartDate: today,
      },
      {
        name: 'Test Event 3',
        location: 'Terst, TN',
        url: 'https://www.va.gov',
        eventStartDate: twoDaysAhead,
        displayStartDate: today,
      },
    ];

    const wrapper = mount(<ScoEventsWidget scoEvents={scoEvents} />);

    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(3);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(0)
        .text(),
    ).to.contain(scoEvents[1].name);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(1)
        .text(),
    ).to.contain(scoEvents[0].name);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(2)
        .text(),
    ).to.contain(scoEvents[2].name);
    wrapper.unmount();
  });
});
