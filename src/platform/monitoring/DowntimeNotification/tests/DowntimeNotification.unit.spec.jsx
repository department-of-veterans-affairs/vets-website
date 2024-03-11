import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { createServiceMap } from '../util/helpers';
import { externalServices, externalServiceStatus } from '../index';
import DowntimeNotification from '../containers/DowntimeNotification';

const innerText = 'This is the inner text';

const defaultProps = {
  dependencies: [],
  getGlobalDowntime: () => {},
  getScheduledDowntime: () => {},
  shouldSendRequest: true,
};

const getComponent = (props, store) =>
  shallow(
    <DowntimeNotification {...defaultProps} {...props}>
      <span>{innerText}</span>
    </DowntimeNotification>,
    { context: { store } },
  );

describe('<DowntimeNotification/>', () => {
  let store;
  let useDispatchSpy;
  let useSelectorSpy;

  beforeEach(() => {
    useDispatchSpy = sinon.spy();
    useSelectorSpy = sinon.stub();
    store = {
      dispatch: useDispatchSpy,
      getState: () => ({
        scheduledDowntime: {
          dismissedDowntimeWarnings: [],
          globalDowntime: null,
          isPending: false,
          isReady: false,
          serviceMap: {},
        },
      }),
      subscribe: () => {},
    };
  });

  it('calls getGlobalDowntime and getScheduledDowntime when rendered', () => {
    const props = {
      dependencies: [],
      getScheduledDowntime: sinon.spy(),
      getGlobalDowntime: sinon.spy(),
    };
    getComponent(props, store);
    expect(props.getScheduledDowntime.calledOnce).to.be.true;
  });

  describe('No impending downtime', () => {
    it('should render the children components when there are no dependencies', () => {
      useSelectorSpy.returns({
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: {},
      });
      const wrapper = getComponent({}, store);
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have no downtime', () => {
      useSelectorSpy.returns({
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: {},
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mvi] },
        store,
      );
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });
  });

  describe('Approaching downtime', () => {
    it('should render the children and a Modal when downtime is approaching', () => {
      useSelectorSpy.returns({
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: createServiceMap([
          {
            attributes: {
              externalService: externalServices.mhv,
              startTime: moment().toISOString(),
              endTime: moment()
                .add(1, 'day')
                .toISOString(),
            },
          },
        ]),
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mhv] },
        store,
      );
      const downtimeApproaching = wrapper.find('DowntimeApproaching').dive();
      const innerWrapper = downtimeApproaching
        .find('DowntimeNotificationWrapper')
        .dive();

      expect(innerWrapper.text()).to.contain(
        innerText,
        'The message was rendered',
      );
      expect(
        innerWrapper.find(
          `[data-status="${externalServiceStatus.downtimeApproaching}"]`,
        ),
      ).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find(VaModal)).to.have.lengthOf(
        1,
        'Authenticated users will see a modal',
      );
    });
  });

  describe('In downtime', () => {
    it('should not render the children when we are in downtime and instead show an AlertBox', () => {
      useSelectorSpy.returns({
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: createServiceMap([
          {
            attributes: {
              externalService: externalServices.mhv,
              startTime: moment()
                .subtract(1, 'day')
                .toISOString(),
              endTime: moment()
                .add(1, 'day')
                .toISOString(),
            },
          },
        ]),
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mhv] },
        store,
      );
      const down = wrapper.find('Down').dive();
      const innerWrapper = down.find('DowntimeNotificationWrapper').dive();

      expect(innerWrapper.text()).to.not.contain(
        innerText,
        'The message was not rendered',
      );
      expect(
        innerWrapper.find(`[data-status="${externalServiceStatus.down}"]`),
      ).to.have.lengthOf(1, 'The correct status was rendered');
      expect(innerWrapper.find('h3')).to.have.lengthOf(
        1,
        'Authenticated users will see a plain <h3>',
      );
    });
  });

  describe('custom render', () => {
    it('allows a custom render property', () => {
      useSelectorSpy.returns({
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: createServiceMap([
          {
            attributes: {
              externalService: externalServices.mhv,
              startTime: moment()
                .subtract(1, 'day')
                .toISOString(),
              endTime: moment()
                .add(1, 'day')
                .toISOString(),
            },
          },
        ]),
      });
      const render = (downtime, children) => (
        <div>
          <h1>Custom render for status {downtime.status}</h1>
          {children}
        </div>
      );
      const props = { dependencies: [externalServices.mhv], render };

      const wrapper = getComponent(props, store);

      const text = wrapper.text();

      expect(text).to.contain(
        `Custom render for status ${externalServiceStatus.down}`,
        'Custom render works',
      );
      expect(text).to.contain(innerText, 'Custom render passes children nodes');
    });
  });
});
