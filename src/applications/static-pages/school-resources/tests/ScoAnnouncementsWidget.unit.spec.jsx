import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';
import ScoAnnouncementsWidget from '../ScoAnnouncementsWidget';

describe('<ScoAnnouncementsWidget>', () => {
  it('renders correctly', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const announcements = [
      {
        name: 'Test Announcement',
        url: 'https://www.va.gov',
        date: today,
        displayStartDate: today,
      },
    ];

    const wrapper = mount(
      <ScoAnnouncementsWidget announcements={announcements} />,
    );
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('does not display announcements before their displayStartDate', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const tomorrow = moment(today)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const announcements = [
      {
        name: 'Test Announcement',
        url: 'https://www.va.gov',
        date: today,
        displayStartDate: tomorrow,
      },
    ];

    const wrapper = mount(
      <ScoAnnouncementsWidget announcements={announcements} />,
    );
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('does not display announcements past their displayEndDate', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const yesterday = moment(today)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const announcements = [
      {
        name: 'Test Announcement',
        url: 'https://www.va.gov',
        date: today,
        displayStartDate: today,
        displayEndDate: yesterday,
      },
    ];

    const wrapper = mount(
      <ScoAnnouncementsWidget announcements={announcements} />,
    );
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('does not display announcements past their default displayEndDate', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const thirtyDaysAgo = moment(today)
      .subtract(30, 'day')
      .format('YYYY-MM-DD');
    const announcements = [
      {
        name: 'Test Announcement',
        url: 'https://www.va.gov',
        date: thirtyDaysAgo,
        displayStartDate: today,
      },
    ];

    const wrapper = mount(
      <ScoAnnouncementsWidget announcements={announcements} />,
    );
    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('orders announcements by date descending', () => {
    const today = moment()
      .startOf('day')
      .format('YYYY-MM-DD');
    const yesterday = moment(today)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const tomorrow = moment(today)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const announcements = [
      {
        name: 'Test Announcement 2',
        url: 'https://www.va.gov',
        date: today,
        displayStartDate: today,
      },
      {
        name: 'Test Announcement 1',
        url: 'https://www.va.gov',
        date: tomorrow,
        displayStartDate: today,
      },
      {
        name: 'Test Announcement 3',
        url: 'https://www.va.gov',
        date: yesterday,
        displayStartDate: today,
      },
    ];

    const wrapper = mount(
      <ScoAnnouncementsWidget announcements={announcements} />,
    );

    expect(wrapper.find('.hub-page-link-list__item')).to.have.lengthOf(3);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(0)
        .text(),
    ).to.contain(announcements[1].name);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(1)
        .text(),
    ).to.contain(announcements[0].name);
    expect(
      wrapper
        .find('.hub-page-link-list__item')
        .at(2)
        .text(),
    ).to.contain(announcements[2].name);
    wrapper.unmount();
  });
});
