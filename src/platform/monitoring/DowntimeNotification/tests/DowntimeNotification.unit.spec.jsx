import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { createServiceMap } from '../util/helpers';
import { services, serviceStatus } from '../index';
import { DowntimeNotification } from '../containers/DowntimeNotification';

const beforeNow = moment().subtract(1, 'minute').toDate();
const withinHour = moment().add(1, 'hour').subtract(1, 'minute').toDate();
const moreThanHour = moment().add(1, 'hour').add(1, 'hour').toDate();
const endTime = moment().add(6, 'hour').toDate();
let old;

const innerText = 'This is the inner text';
function getComponent(dependencies = [], getScheduledDowntime = () => {}, otherProps = {}) {
  return enzyme.shallow(
    <DowntimeNotification dependencies={dependencies} getScheduledDowntime={getScheduledDowntime} {...otherProps} shouldSendRequest>
      <span>{innerText}</span>
    </DowntimeNotification>
  );
}

describe('<DowntimeNotification/>', () => {

  beforeEach(() => {
    old = { sessionStorage: window.sessionStorage };
    window.sessionStorage = {};
  });

  afterEach(() => {
    window.sessionStorage = old.sessionStorage;
  });

  it('calls getScheduledDowntime when rendered', () => {
    const getScheduledDowntime = sinon.spy();
    getComponent([], getScheduledDowntime);
    expect(getScheduledDowntime.calledOnce).to.be.true;
  });

  describe('No impending downtime', () => {

    it('should render the children components when there are no dependencies', () => {
      const wrapper = getComponent();
      wrapper.setProps({ isReady: true, serviceMap: new Map() });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have no downtime', () => {
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, serviceMap: new Map() });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have downtime but it\'s over an hour away', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: services.mvi,
            startTime: moreThanHour,
            endTime
          }
        }
      ]);
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, serviceMap });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should ignore downtime for services that are not dependencies', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: services.mhv,
            startTime: beforeNow,
            endTime
          },
        },
        {
          attributes: {
            externalService: services.arcgis,
            startTime: beforeNow,
            endTime
          },
        },
        {
          attributes: {
            externalService: services.evss,
            startTime: beforeNow,
            endTime
          }
        }
      ]);
      const wrapper = getComponent([services.mvi]);
      wrapper.setProps({ isReady: true, serviceMap });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });
  });

  describe('Approaching downtime', () => {
    it('should render the children and a Modal when downtime is approaching for authenticated users', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: services.mhv,
            startTime: withinHour,
            endTime
          }
        }
      ]);

      const wrapper = getComponent([services.mhv]);
      wrapper.setProps({ isReady: true, serviceMap });

      const downtimeApproaching = wrapper.find('DowntimeApproaching').dive();
      const innerWrapper = downtimeApproaching.find('DowntimeNotificationWrapper').dive();

      expect(innerWrapper.text()).to.contain(innerText, 'The message was rendered');
      expect(innerWrapper.find(`[data-status="${serviceStatus.downtimeApproaching}"]`)).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find('Modal')).to.have.lengthOf(1, 'Authenticated users will see a modal');
    });
  });

  describe('In downtime', () => {
    it('should not render the children when we are in downtime and instead show an AlertBox for unauthenticated users', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: services.appeals,
            startTime: moreThanHour,
            endTime
          }
        },
        {
          attributes: {
            externalService: services.mhv,
            startTime: beforeNow,
            endTime
          }
        }
      ]);

      const wrapper = getComponent([services.mhv]);
      wrapper.setProps({ isReady: true, serviceMap });

      const down = wrapper.find('Down').dive();
      const innerWrapper = down.find('DowntimeNotificationWrapper').dive();

      expect(innerWrapper.text()).to.not.contain(innerText, 'The message was not rendered');
      expect(innerWrapper.find(`[data-status="${serviceStatus.down}"]`)).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find('h3')).to.have.lengthOf(1, 'Authenticated users will see a plain <h2>');
    });
  });

  describe('custom render', () => {
    it('allows a custom render property', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: services.mhv,
            startTime: beforeNow,
            endTime
          }
        }
      ]);

      const render = (downtime, children) => {
        return (
          <div>
            <h1>Custom render for status {downtime.status}</h1>
            {children}
          </div>
        );
      };

      const wrapper = getComponent([services.mhv], () => {}, { render });
      wrapper.setProps({ isReady: true, serviceMap });

      const text = wrapper.text();

      expect(text).to.contain(`Custom render for status ${serviceStatus.down}`, 'Custom render works');
      expect(text).to.contain(innerText, 'Custom render passes children nodes');
    });
  });
});
