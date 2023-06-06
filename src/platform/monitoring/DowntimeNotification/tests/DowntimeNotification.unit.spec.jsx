import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { createServiceMap } from '../util/helpers';
import { externalServices, externalServiceStatus } from '../index';
import {
  DowntimeNotification,
  mapStateToProps,
} from '../containers/DowntimeNotification';

const innerText = 'This is the inner text';

const defaultProps = {
  dependencies: [],
  getGlobalDowntime: () => {},
  getScheduledDowntime: () => {},
  shouldSendRequest: true,
};

const getComponent = props =>
  enzyme.shallow(
    <DowntimeNotification {...defaultProps} {...props}>
      <span>{innerText}</span>
    </DowntimeNotification>,
  );

describe('mapStateToProps', () => {
  it('should set shouldSendRequest to true when scheduled downtime is not ready and a request is not pending', () => {
    const scheduledDowntime = {
      isReady: false,
      isPending: false,
      dismissedDowntimeWarnings: [],
    };

    const ownProps = {
      appTitle: 'test app',
      dependencies: ['Service A'],
    };

    const props = mapStateToProps({ scheduledDowntime }, ownProps);
    expect(props.shouldSendRequest).to.be.true;
    expect(props.status).to.be.undefined;
  });

  it('should have properties of a downtime object if downtime is found', () => {
    const serviceMap = createServiceMap([
      {
        attributes: {
          externalService: 'myservice',
          startTime: moment().toISOString(),
          endTime: moment()
            .add(1, 'day')
            .toISOString(),
        },
      },
    ]);

    const scheduledDowntime = {
      isReady: true,
      isPending: false,
      dismissedDowntimeWarnings: [],
      serviceMap,
    };

    const ownProps = {
      appTitle: 'My app',
      dependencies: ['myservice'],
    };

    const props = mapStateToProps({ scheduledDowntime }, ownProps);

    expect(props).to.include.all.keys([
      'externalService',
      'status',
      'startTime',
      'endTime',
    ]);
  });
});

describe('<DowntimeNotification/>', () => {
  it('calls getGlobalDowntime and getScheduledDowntime when rendered', () => {
    const props = {
      dependencies: [],
      getScheduledDowntime: sinon.spy(),
      getGlobalDowntime: sinon.spy(),
    };
    getComponent(props);
    // expect(props.getGlobalDowntime.calledOnce).to.be.true;
    expect(props.getScheduledDowntime.calledOnce).to.be.true;
  });

  describe('No impending downtime', () => {
    it('should render the children components when there are no dependencies', () => {
      const wrapper = getComponent();
      wrapper.setProps({ isReady: true });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });

    it('should render the children components when dependencies have no downtime', () => {
      const wrapper = getComponent([externalServices.mvi]);
      wrapper.setProps({ isReady: true });
      expect(wrapper.text()).to.contain(innerText, 'The message was rendered.');
    });
  });

  describe('Approaching downtime', () => {
    it('should render the children and a Modal when downtime is approaching', () => {
      const wrapper = getComponent({ dependencies: [externalServices.mhv] });
      wrapper.setProps({
        isReady: true,
        initializeDowntimeWarnings() {},
        startTime: moment(),
        endTime: moment(),
        status: externalServiceStatus.downtimeApproaching,
      });

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
    xit('should not render the children when we are in downtime and instead show an AlertBox', () => {
      const wrapper = getComponent({ dependencies: [externalServices.mhv] });

      wrapper.setProps({ isReady: true, status: externalServiceStatus.down });

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
        'Authenticated users will see a plain <h2>',
      );
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

      const props = { dependencies: [externalServices.mhv], render };

      const wrapper = getComponent(props);
      wrapper.setProps({ isReady: true, status: externalServiceStatus.down });

      const text = wrapper.text();

      expect(text).to.contain(
        `Custom render for status ${externalServiceStatus.down}`,
        'Custom render works',
      );
      expect(text).to.contain(innerText, 'Custom render passes children nodes');
    });
  });
});
