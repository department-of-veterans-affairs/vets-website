import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';
import startApp from '../withoutRouter';
import * as reactUtils from '../react';
import * as setupUtils from '../setup';

describe('startApp', () => {
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
    const mockRouterProvider = <RouterProvider router={mockRouter} />;
    const mockReducer = {};
    const mockUrl = '/test';
    const mockAnalyticsEvents = [];
    const mockEntryName = 'testApp';
    const mockPreloadScheduledDowntimes = true;

    startApp({
      router: mockRouterProvider,
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
