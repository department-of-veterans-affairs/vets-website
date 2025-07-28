import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
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
        additionalMiddlewares: [],
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

  it('should pass additional middlewares to setUpCommonFunctionality', () => {
    const mockStore = {};
    setUpCommonFunctionalityStub.returns(mockStore);

    // Create mock middlewares
    const mockMiddlewareOne = () => next => action =>
      next({ ...action, modified: true });
    const mockMiddlewareTwo = () => next => action => next(action);
    const mockAdditionalMiddlewares = [mockMiddlewareOne, mockMiddlewareTwo];

    const mockRouter = {};
    const mockRouterProvider = <RouterProvider router={mockRouter} />;

    startApp({
      router: mockRouterProvider,
      reducer: {},
      additionalMiddlewares: mockAdditionalMiddlewares,
    });

    // Verify the middlewares were passed correctly
    expect(setUpCommonFunctionalityStub.calledOnce).to.be.true;
    expect(
      setUpCommonFunctionalityStub.calledWith(
        sinon.match({
          additionalMiddlewares: mockAdditionalMiddlewares,
        }),
      ),
    ).to.be.true;

    // Verify that the middlewares array is exactly the same instance that was passed
    const actualMiddlewares =
      setUpCommonFunctionalityStub.firstCall.args[0].additionalMiddlewares;
    expect(actualMiddlewares).to.equal(mockAdditionalMiddlewares);
  });
});
