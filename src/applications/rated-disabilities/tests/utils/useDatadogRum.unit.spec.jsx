import { expect } from 'chai';
import sinon from 'sinon';

import React from 'react';

import { datadogRum } from '@datadog/browser-rum';
import { render, waitFor } from '@testing-library/react';

import { useBrowserMonitoring } from '../../util/datadog-rum/useBrowserMonitoring';
import * as initializeRealUserMonitoring from '../../util/datadog-rum/initializeRealUserMonitoring';
import * as constants from '../../constants';

const TestComponent = ({ loggedIn = false }) => {
  useBrowserMonitoring({ loggedIn });
  return null;
};

describe('initializeRealUserMonitoring', () => {
  let enableRUMStub;
  let initSpy;
  let startSessionReplayRecordingStub;

  beforeEach(() => {
    enableRUMStub = sinon.stub(constants, 'enableRUM');
    initSpy = sinon.spy(datadogRum, 'init');
    startSessionReplayRecordingStub = sinon.stub(
      datadogRum,
      'startSessionReplayRecording',
    );
  });

  afterEach(() => {
    enableRUMStub.restore();
    initSpy.restore();
    startSessionReplayRecordingStub.restore();
  });

  context('when useRUM is true', () => {
    it('should call init and startSessionReplayRecording ', () => {
      enableRUMStub.returns(true);
      initializeRealUserMonitoring.default();
      expect(initSpy.called).to.be.true;
      expect(initSpy.calledOnce).to.be.true;
      expect(startSessionReplayRecordingStub.calledOnce).to.be.true;
    });
  });
  context('when useRUM is false', () => {
    it('should not call init and startSessionReplayRecording ', () => {
      enableRUMStub.returns(false);
      initializeRealUserMonitoring.default();
      expect(initSpy.notCalled).to.be.true;
      expect(startSessionReplayRecordingStub.notCalled).to.be.true;
    });
  });
});

describe('useBrowserMonitoring', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(initializeRealUserMonitoring, 'default');
  });

  afterEach(() => {
    stub.restore();
  });

  context('when loggedIn false', () => {
    // Added async for these tests since there is a useEffect
    it('it should return', async () => {
      await waitFor(() => {
        render(<TestComponent />);
        expect(stub.notCalled).to.be.true;
        expect(stub.called).to.be.false;
      });
    });
  });
  context('when loggedIn true', () => {
    it('it should call initializeRealUserMonitoring', async () => {
      await waitFor(() => {
        render(<TestComponent loggedIn />);
        expect(stub.called).to.be.true;
      });
    });
  });
});
