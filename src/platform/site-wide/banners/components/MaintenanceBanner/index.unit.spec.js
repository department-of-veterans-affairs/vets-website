// Node modules.
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';
// Relative imports.
import MaintenanceBanner, { MAINTENANCE_BANNER } from './index';

const deriveDefaultProps = (startsAt = moment()) => {
  const expiresAt = startsAt.clone().add(2, 'hours');
  const formattedStartsAt = startsAt.format('dddd M/D, h:mm a');
  const formattedExpiresAt = expiresAt.format('dddd M/D, h:mm a');

  return {
    id: '1',
    startsAt,
    expiresAt,
    title: 'DS Logon is down for maintenance.',
    content:
      'DS Logon is down for maintenance. Please use ID.me or MyHealtheVet to sign in or use online tools.',
    warnStartsAt: startsAt.clone().subtract(12, 'hours'),
    warnTitle: 'DS Logon will be down for maintenance',
    warnContent: `DS Logon will be unavailable from ${formattedStartsAt} to ${formattedExpiresAt} Please use ID.me or MyHealtheVet to sign in or use online tools during this time.`,
  };
};

describe('<MaintenanceBanner>', () => {
  it('Escapes early if the banner is dismissed.', () => {
    localStorage.setItem(MAINTENANCE_BANNER, '1');
    const wrapper = mount(<MaintenanceBanner {...deriveDefaultProps()} />);
    expect(wrapper.type()).to.equal(null);
    localStorage.removeItem(MAINTENANCE_BANNER);
    wrapper.unmount();
  });

  it("Escapes early if it's before when it should show.", () => {
    const wrapper = mount(
      <MaintenanceBanner {...deriveDefaultProps(moment().add(13, 'hours'))} />,
    );
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('Shows pre-downtime.', () => {
    const wrapper = mount(
      <MaintenanceBanner {...deriveDefaultProps(moment().add(2, 'hours'))} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.html()).to.include('vads-u-border-color--warning-message');
    wrapper.unmount();
  });

  it('Shows downtime.', () => {
    const wrapper = mount(
      <MaintenanceBanner {...deriveDefaultProps(moment().add(2, 'hours'))} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.html()).to.include('vads-u-border-color--secondary');
    wrapper.unmount();
  });

  it("Escapes early if it's after when it should show.", () => {
    const wrapper = mount(
      <MaintenanceBanner
        {...deriveDefaultProps(moment().subtract(3, 'hours'))}
      />,
    );
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });
});
