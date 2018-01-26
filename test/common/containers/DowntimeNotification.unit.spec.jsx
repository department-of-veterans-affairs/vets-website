import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { DowntimeNotification, services, serviceStatus } from '../../../src/js/common/containers/DowntimeNotification';

const beforeNow = moment().subtract(1, 'minute').toDate();
const withinHour = moment().add(1, 'hour').subtract(1, 'minute').toDate();
const moreThanHour = moment().add(1, 'hour').add(1, 'hour').toDate();
const endTime = moment().add(6, 'hour').toDate();

const innerText = 'This is the inner text';
function getComponent(dependencies = [], getScheduledDowntime = () => {}) {
  return enzyme.shallow(
    <DowntimeNotification dependencies={dependencies} scheduledDowntime={null} getScheduledDowntime={getScheduledDowntime}>
      <span>{innerText}</span>
    </DowntimeNotification>
  );
}

describe('<DowntimeNotification/>', () => {

  it('calls getScheduledDowntime when rendered', () => {
    const getScheduledDowntime = sinon.spy();
    getComponent([], getScheduledDowntime);
    expect(getScheduledDowntime.calledOnce).to.be.true;
  });

  describe('No impending downtime', () => {

    it('should render the children components when there are no dependencies', () => {
      const wrapper = getComponent();
      wrapper.setProps({ isReady: true, scheduledDowntime: [] });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have no downtime', () => {
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, scheduledDowntime: [] });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have downtime but it\'s over an hour away', () => {
      const scheduledDowntime = [
        { service: services.mvi, startTime: moreThanHour, endTime }
      ];
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, scheduledDowntime });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should ignore downtime for services that are not dependencies', () => {
      const scheduledDowntime = [
        { service: services.mhv, startTime: beforeNow, endTime },
        { service: services.arcgis, startTime: beforeNow, endTime },
        { service: services.evss, startTime: beforeNow, endTime }
      ];
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, scheduledDowntime });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });
  });

  describe('Impending downtime', () => {

    const scheduledDowntime = [
      { service: services.mhv, startTime: withinHour, endTime }
    ];

    it('should render the children and a Modal when downtime is approaching for authenticated users', () => {
      const wrapper = getComponent([services.mhv]);
      wrapper.setProps({ isReady: true, scheduledDowntime });
      const innerWrapper = wrapper.find('DowntimeNotificationWrapper').dive();
      expect(innerWrapper.text()).to.contain(innerText, 'The message was rendered');
      expect(innerWrapper.find(`[data-status="${serviceStatus.downtimeApproaching}"]`)).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find('Modal')).to.have.lengthOf(1, 'Authenticated users will see a modal');
    });
  });

  describe('In downtime', () => {

    const scheduledDowntime = [
      { service: services.appeals, startTime: moreThanHour, endTime },
      { service: services.mhv, startTime: beforeNow, endTime }
    ];

    it('should not render the children when we are in downtime and instead show an AlertBox for unauthenticated users', () => {
      const wrapper = getComponent([services.mhv]);
      wrapper.setProps({ isReady: true, scheduledDowntime });
      const innerWrapper = wrapper.find('DowntimeNotificationWrapper').dive();
      expect(innerWrapper.text()).to.not.contain(innerText, 'The message was not rendered');
      expect(innerWrapper.find(`[data-status="${serviceStatus.down}"]`)).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find('h3')).to.have.lengthOf(1, 'Authenticated users will see a plain <h2>');
    });

  });

  it('should only render when isReady is flipped from false to true and ignore future prop changes', () => {
    const wrapper = getComponent();
    wrapper.setProps({ isReady: true, scheduledDowntime: [] });
    expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');

    const scheduledDowntime = [
      { service: services.mhv, startTime: beforeNow, endTime }
    ];
    wrapper.setProps({ scheduledDowntime });
    expect(wrapper.text()).to.contain(innerText, 'The downtime was ignored.');
  });

});
