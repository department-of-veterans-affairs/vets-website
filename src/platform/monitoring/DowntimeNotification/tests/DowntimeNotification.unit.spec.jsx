import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { externalServices, externalServiceStatus } from '../index';
import DowntimeNotification from '../containers/DowntimeNotification';

const mockStore = configureStore([]);

const innerText = 'This is the inner text';

const defaultProps = {
  dependencies: [],
};

const getComponent = (props, store) =>
  mount(
    <Provider store={store}>
      <DowntimeNotification {...defaultProps} {...props}>
        <span>{innerText}</span>
      </DowntimeNotification>
    </Provider>,
  );

describe('<DowntimeNotification/>', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      scheduledDowntime: {
        dismissedDowntimeWarnings: [],
        isPending: false,
        isReady: false,
        serviceMap: {},
      },
    });
  });

  it('calls getScheduledDowntime when rendered', () => {
    const getScheduledDowntime = sinon.spy();
    store.dispatch = getScheduledDowntime;
    getComponent({}, store);
    expect(getScheduledDowntime.calledOnce).to.be.true;
  });

  describe('No impending downtime', () => {
    it('should render the children components when there are no dependencies', () => {
      store = mockStore({
        scheduledDowntime: {
          isReady: true,
          serviceMap: {},
        },
      });
      const wrapper = getComponent({}, store);
      expect(wrapper.text()).to.contain(innerText);
    });

    it('should render the children components when dependencies have no downtime', () => {
      store = mockStore({
        scheduledDowntime: {
          isReady: true,
          serviceMap: {},
        },
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mvi] },
        store,
      );
      expect(wrapper.text()).to.contain(innerText);
    });
  });

  describe('Approaching downtime', () => {
    it('should render the children and a Modal when downtime is approaching', () => {
      store = mockStore({
        scheduledDowntime: {
          isReady: true,
          serviceMap: {
            [externalServices.mhv]: {
              status: externalServiceStatus.downtimeApproaching,
              startTime: moment(),
              endTime: moment(),
            },
          },
        },
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mhv] },
        store,
      );
      expect(wrapper.text()).to.contain(innerText);
      expect(wrapper.find('DowntimeApproaching')).to.have.lengthOf(1);
    });
  });

  describe('In downtime', () => {
    it('should not render the children when we are in downtime and instead show an AlertBox', () => {
      store = mockStore({
        scheduledDowntime: {
          isReady: true,
          serviceMap: {
            [externalServices.mhv]: {
              status: externalServiceStatus.down,
              startTime: moment(),
              endTime: moment(),
            },
          },
        },
      });
      const wrapper = getComponent(
        { dependencies: [externalServices.mhv] },
        store,
      );
      expect(wrapper.text()).to.not.contain(innerText);
      expect(wrapper.find('Down')).to.have.lengthOf(1);
      expect(wrapper.find('h3')).to.have.lengthOf(1);
    });
  });

  describe('custom render', () => {
    it('allows a custom render property', () => {
      const render = (downtime, children) => (
        <div>
          <h1>Custom render for status {downtime.status}</h1>
          {children}
        </div>
      );

      store = mockStore({
        scheduledDowntime: {
          isReady: true,
          serviceMap: {
            [externalServices.mhv]: {
              status: externalServiceStatus.down,
              startTime: moment(),
              endTime: moment(),
            },
          },
        },
      });

      const props = { dependencies: [externalServices.mhv], render };
      const wrapper = getComponent(props, store);

      expect(wrapper.text()).to.contain(
        `Custom render for status ${externalServiceStatus.down}`,
      );
      expect(wrapper.text()).to.contain(innerText);
    });
  });
});
