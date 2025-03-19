import { expect } from 'chai';
import sinon from 'sinon';

import React from 'react';

import { datadogRum } from '@datadog/browser-rum';
import { render } from '@testing-library/react';

import * as initializeRealUserMonitoring from '../../util/datadog-rum/initializeRealUserMonitoring';
import { useBrowserMonitoring } from '../../util/datadog-rum/useBrowserMonitoring';
// eslint-disable-next-line react/prop-types
const TestComponent = ({ loggedIn = false }) => {
  useBrowserMonitoring({ loggedIn });
  return <div data-testid="test" />;
};

describe('initializeRealUserMonitoring', () => {
  // let envStub;
  let initSpy;
  let startSessionReplayRecordingStub;

  beforeEach(() => {
    // envStub = sinon.stub(constants, 'isProductionEnv');
    initSpy = sinon.spy(datadogRum, 'init');
    startSessionReplayRecordingStub = sinon.stub(
      datadogRum,
      'startSessionReplayRecording',
    );
  });

  afterEach(() => {
    // envStub.restore();
    initSpy.restore();
    startSessionReplayRecordingStub.restore();
  });

  context('when isProductionEnv is true', () => {
    it('should call init and startSessionReplayRecording ', () => {
      // envStub.returns(true);
      initializeRealUserMonitoring.initializeRealUserMonitoring();
      expect(initSpy.called).to.be.true;

      expect(initSpy.calledOnce).to.be.true;
      expect(startSessionReplayRecordingStub.calledOnce).to.be.true;
    });
  });
  context('when isProductionEnv is false', () => {
    it('should not call init and startSessionReplayRecording ', () => {
      // envStub.returns(false);
      initializeRealUserMonitoring.initializeRealUserMonitoring();
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
    it('it should return', () => {
      render(<TestComponent />);

      expect(stub.notCalled).to.be.true;
    });
  });
  context('when loggedIn true', () => {
    it('it should call initializeRealUserMonitoring', () => {
      render(<TestComponent loggedIn />);
      expect(stub.called).to.be.true;
    });
  });
});
