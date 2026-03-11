import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as historyV4 from 'history-v4';
import * as navActions from 'platform/site-wide/user-nav/actions';
import * as reactApp from '../react';
import * as commonFunctionality from '../setup';
import startApp from '../router';

describe('startApp (v5 router)', () => {
  let sandbox;
  let storeStub;
  let setUpCommonFunctionalityStub;
  let startReactAppStub;
  let updateRouteStub;
  let historyStub;
  let listenStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    storeStub = {
      dispatch: sinon.stub(),
      getState: sinon.stub(),
    };
    listenStub = sinon.stub();
    historyStub = {
      location: { pathname: '/', search: '', hash: '' },
      listen: listenStub,
      push: sinon.stub(),
      replace: sinon.stub(),
    };
    setUpCommonFunctionalityStub = sandbox
      .stub(commonFunctionality, 'default')
      .returns(storeStub);
    startReactAppStub = sandbox.stub(reactApp, 'default');
    updateRouteStub = sandbox
      .stub(navActions, 'updateRoute')
      .returns({ type: 'UPDATE_ROUTE', location: {} });
    sandbox.stub(historyV4, 'createBrowserHistory').returns(historyStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a store with setUpCommonFunctionality', () => {
    startApp({ entryName: 'testApp' });
    expect(setUpCommonFunctionalityStub.called).to.be.true;
  });

  it('should pass entryName and url to setUpCommonFunctionality', () => {
    startApp({ entryName: 'testApp', url: '/foo' });
    const callArgs = setUpCommonFunctionalityStub.firstCall.args[0];
    expect(callArgs.entryName).to.equal('testApp');
    expect(callArgs.url).to.equal('/foo');
  });

  it('should create browser history with basename from url', () => {
    startApp({ entryName: 'testApp', url: '/my-app' });
    expect(historyV4.createBrowserHistory.calledWith({ basename: '/my-app' }))
      .to.be.true;
  });

  it('should create browser history with empty basename when no url', () => {
    startApp({ entryName: 'testApp' });
    expect(historyV4.createBrowserHistory.calledWith({ basename: '' })).to.be
      .true;
  });

  it('should dispatch updateRoute with initial location', () => {
    startApp({ entryName: 'testApp', url: '/foo' });
    expect(updateRouteStub.calledWith(historyStub.location)).to.be.true;
    expect(storeStub.dispatch.called).to.be.true;
  });

  it('should subscribe to history changes', () => {
    startApp({ entryName: 'testApp', url: '/foo' });
    expect(listenStub.calledOnce).to.be.true;
  });

  it('should dispatch updateRoute on history change', () => {
    startApp({ entryName: 'testApp', url: '/foo' });

    // Get the listener callback that was registered
    const listener = listenStub.firstCall.args[0];
    const newLocation = { pathname: '/bar', search: '', hash: '' };
    listener(newLocation);

    // updateRoute called twice: once for initial, once for listen
    expect(updateRouteStub.calledWith(newLocation)).to.be.true;
    expect(storeStub.dispatch.callCount).to.equal(2);
  });

  it('should not dispatch updateRoute on null location from listen', () => {
    startApp({ entryName: 'testApp', url: '/foo' });

    const listener = listenStub.firstCall.args[0];
    listener(null);

    // Only the initial dispatch, not a second one
    expect(storeStub.dispatch.callCount).to.equal(1);
  });

  it('should render React component with routes', () => {
    const routes = <div>Routes</div>;
    startApp({ entryName: 'testApp', routes });
    expect(startReactAppStub.called).to.be.true;
  });

  it('should render React component with createRoutesWithStore', () => {
    const createRoutesWithStore = sinon.stub().returns(<div>Routes</div>);
    startApp({ entryName: 'testApp', createRoutesWithStore });
    expect(createRoutesWithStore.calledWith(storeStub)).to.be.true;
    expect(startReactAppStub.called).to.be.true;
  });

  it('should render React component with plain component', () => {
    const component = <div>Component</div>;
    startApp({ entryName: 'testApp', component });
    expect(startReactAppStub.called).to.be.true;
  });

  it('should return the store', () => {
    const result = startApp({ entryName: 'testApp' });
    expect(result).to.equal(storeStub);
  });

  it('should not throw when updateRoute throws', () => {
    updateRouteStub.throws(new Error('test error'));
    expect(() => startApp({ entryName: 'testApp', url: '/foo' })).to.not.throw;
  });
});
