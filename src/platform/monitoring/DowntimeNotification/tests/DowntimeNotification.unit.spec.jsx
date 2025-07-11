import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { addDays, addHours } from 'date-fns';
import { createServiceMap } from '../util/helpers';
import { externalServices, externalServiceStatus } from '../index';
import {
  DowntimeNotification,
  mapStateToProps,
} from '../containers/DowntimeNotification';

const innerText = 'This is the inner text';

const defaultProps = {
  appTitle: 'Test App',
  dependencies: [],
  getGlobalDowntime: () => {},
  getScheduledDowntime: () => {},
  shouldSendRequest: true,
};

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
    const now = new Date();
    const serviceMap = createServiceMap([
      {
        attributes: {
          externalService: 'myservice',
          startTime: now?.toISOString(),
          endTime: addDays(now, 1)?.toISOString(),
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
  it('calls getScheduledDowntime when rendered', async () => {
    const getScheduledDowntime = sinon.spy();
    render(
      <DowntimeNotification
        {...defaultProps}
        getScheduledDowntime={getScheduledDowntime}
      >
        <span>{innerText}</span>
      </DowntimeNotification>,
    );
    await waitFor(() => {
      expect(getScheduledDowntime.calledOnce).to.be.true;
    });
  });

  describe('No impending downtime', () => {
    it('should render children when isReady and no downtime', () => {
      const { getByText } = render(
        <DowntimeNotification {...defaultProps} isReady>
          <span>{innerText}</span>
        </DowntimeNotification>,
      );
      expect(getByText(innerText)).to.exist;
    });

    it('should render children when dependencies have no downtime', () => {
      const { getByText } = render(
        <DowntimeNotification
          {...defaultProps}
          dependencies={[externalServices.mvi]}
          isReady
        >
          <span>{innerText}</span>
        </DowntimeNotification>,
      );
      expect(getByText(innerText)).to.exist;
    });
  });

  describe('Approaching downtime', () => {
    it('should render downtime approaching modal and children', () => {
      const dt = new Date('2025-06-25T16:00:00-00:00');
      const dismissDowntimeWarning = sinon.stub();
      const initializeDowntimeWarnings = sinon.stub();
      const { getByText } = render(
        <DowntimeNotification
          {...defaultProps}
          dependencies={[externalServices.mhv]}
          isReady
          startTime={dt}
          endTime={addHours(dt, 2)}
          status={externalServiceStatus.downtimeApproaching}
          appTitle="Test App"
          isDowntimeWarningDismissed={false}
          dismissDowntimeWarning={dismissDowntimeWarning}
          initializeDowntimeWarnings={initializeDowntimeWarnings}
        >
          <span>{innerText}</span>
        </DowntimeNotification>,
      );
      expect(getByText(innerText)).to.exist;
      expect(
        getByText(
          /We’ll be doing some work on the Test App on June 25th between/i,
        ),
      ).to.exist;
    });
  });

  describe('In downtime', () => {
    it('should render Down alert when in downtime', () => {
      const { getByText, queryByText } = render(
        <DowntimeNotification
          {...defaultProps}
          dependencies={[externalServices.mhv]}
          isReady
          status={externalServiceStatus.down}
          appTitle="Test App"
        >
          <span>{innerText}</span>
        </DowntimeNotification>,
      );
      expect(getByText(/This application is down for maintenance/i)).to.exist;
      // Should not render children
      expect(queryByText(innerText)).to.not.exist;
    });

    it('should allow a custom render property', () => {
      const renderProp = (downtime, children) => (
        <div>
          <h1>Custom render for status {downtime.status}</h1>
          {children}
        </div>
      );
      const { getByText } = render(
        <DowntimeNotification
          {...defaultProps}
          dependencies={[externalServices.mhv]}
          isReady
          status={externalServiceStatus.down}
          render={renderProp}
        >
          <span>{innerText}</span>
        </DowntimeNotification>,
      );
      expect(
        getByText(`Custom render for status ${externalServiceStatus.down}`),
      ).to.exist;
      expect(getByText(innerText)).to.exist;
    });
  });
});
