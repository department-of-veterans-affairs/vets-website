import React from 'react';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import LaunchMessagingAal from '../../components/util/LaunchMessagingAal';
import * as SmApi from '../../api/SmApi';

// Helper to mock window.DD_RUM
const setupRum = () => {
  const addError = sinon.spy();
  window.DD_RUM = { addError };
  return addError;
};

describe('LaunchMessagingAal', () => {
  let submitStub;
  let addError;
  let useFeatureTogglesStub;

  // Helper to stub useFeatureToggles with a given return value
  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../hooks/useFeatureToggles');
    return sinon.stub(useFeatureToggles, 'default').returns(value);
  };

  beforeEach(() => {
    submitStub = sinon.stub(SmApi, 'submitLaunchMessagingAal');
    addError = setupRum();
    useFeatureTogglesStub = null;
  });

  afterEach(() => {
    submitStub.restore();
    delete window.DD_RUM;
    if (useFeatureTogglesStub && useFeatureTogglesStub.restore) {
      useFeatureTogglesStub.restore();
    }
  });

  it('calls submitLaunchMessagingAal on mount', async () => {
    submitStub.resolves();
    useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: true });
    render(<LaunchMessagingAal />);
    await waitFor(() => {
      expect(submitStub.calledOnce).to.be.true;
    });
    expect(addError.called).to.be.false;
  });

  it('logs error to Datadog if submitLaunchMessagingAal throws', async () => {
    const errorObj = { errors: [{ code: '500', detail: 'fail' }] };
    submitStub.rejects(errorObj);
    useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: true });
    render(<LaunchMessagingAal />);
    await waitFor(() => {
      expect(addError.calledOnce).to.be.true;
      const errorArg = addError.firstCall.args[0];
      expect(errorArg).to.be.instanceOf(Error);
      expect(errorArg.message).to.include(
        'Error submitting AAL on Messaging launch',
      );
      expect(errorArg.message).to.include('fail');
    });
  });

  it('calls submitLaunchMessagingAal on mount when isAalEnabled is true', async () => {
    submitStub.resolves();
    useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: true });
    render(<LaunchMessagingAal />);
    await waitFor(() => {
      expect(submitStub.calledOnce).to.be.true;
    });
    expect(addError.called).to.be.false;
  });

  it('does not call submitLaunchMessagingAal when isAalEnabled is false', async () => {
    useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: false });
    render(<LaunchMessagingAal />);
    await waitFor(() => {
      expect(submitStub.notCalled).to.be.true;
    });
    expect(addError.called).to.be.false;
  });

  it('logs error to Datadog if submitLaunchMessagingAal throws and isAalEnabled is true', async () => {
    const errorObj = { errors: [{ code: '500', detail: 'fail' }] };
    submitStub.rejects(errorObj);
    useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: true });
    render(<LaunchMessagingAal />);
    await waitFor(() => {
      expect(addError.calledOnce).to.be.true;
      const errorArg = addError.firstCall.args[0];
      expect(errorArg).to.be.instanceOf(Error);
      expect(errorArg.message).to.include(
        'Error submitting AAL on Messaging launch',
      );
      expect(errorArg.message).to.include('fail');
    });
  });

  it('does not log error when window.DD_RUM is not initialized', async () => {
    delete window.DD_RUM; // Ensure DD_RUM is undefined
    const errorObj = { errors: [{ code: '500', detail: 'fail' }] };
    submitStub.rejects(errorObj);
    useFeatureTogglesStub = stubUseFeatureToggles({
      isAalEnabled: true,
      largeAttachmentsEnabled: false,
    });

    render(<LaunchMessagingAal />);

    await waitFor(() => {
      expect(submitStub.calledOnce).to.be.true;
    });

    expect(window.DD_RUM).to.be.undefined;
  });
});
