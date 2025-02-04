import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';
import startAppV6 from '../routerV6';
import * as reactUtils from '../react';
import * as setupUtils from '../setup';

describe('startAppV6', () => {
  let setUpCommonFunctionalityStub;
  let startReactAppStub;
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    setUpCommonFunctionalityStub = sandbox.stub(setupUtils, 'default');
    startReactAppStub = sandbox.stub(reactUtils, 'default');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set up common functionality and start the React app', () => {
    const mockStore = {};
    setUpCommonFunctionalityStub.returns(mockStore);

    const mockRouter = {};
    const mockReducer = {};
    const mockUrl = '/test';
    const mockAnalyticsEvents = [];
    const mockEntryName = 'testApp';
    const mockPreloadScheduledDowntimes = true;

    startAppV6({
      router: mockRouter,
      reducer: mockReducer,
      url: mockUrl,
      analyticsEvents: mockAnalyticsEvents,
      entryName: mockEntryName,
      preloadScheduledDowntimes: mockPreloadScheduledDowntimes,
    });

    expect(setUpCommonFunctionalityStub.calledOnce).to.be.true;
    expect(
      setUpCommonFunctionalityStub.calledWith({
        entryName: mockEntryName,
        url: mockUrl,
        reducer: mockReducer,
        analyticsEvents: mockAnalyticsEvents,
        preloadScheduledDowntimes: mockPreloadScheduledDowntimes,
      }),
    ).to.be.true;

    expect(startReactAppStub.calledOnce).to.be.true;
    expect(
      startReactAppStub.calledWith(
        <Provider store={mockStore}>
          <RouterProvider router={mockRouter} />
        </Provider>,
      ),
    ).to.be.true;
  });
});
