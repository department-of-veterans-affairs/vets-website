import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as reactRouter from 'react-router';
import * as history from 'history';
import * as navActions from 'platform/site-wide/user-nav/actions';
import * as reactApp from '../react';
import * as commonFunctionality from '../setup';
import startApp from '../index';

describe('startApp', () => {
  let sandbox;
  let storeStub;
  let setUpCommonFunctionalityStub;
  let startReactAppStub;
  let updateRouteStub;
  let useRouterHistoryStub;
  let createHistoryStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    storeStub = {
      dispatch: sinon.stub(),
      getState: sinon.stub(),
    };
    setUpCommonFunctionalityStub = sandbox
      .stub(commonFunctionality, 'default')
      .returns(storeStub);
    startReactAppStub = sandbox.stub(reactApp, 'default');
    updateRouteStub = sandbox.stub(navActions, 'updateRoute');
    createHistoryStub = sandbox.stub(history, 'createHistory').returns({
      getCurrentLocation: sinon.stub().returns({ pathname: '/' }),
      listen: sinon.stub(),
    });
    useRouterHistoryStub = sandbox
      .stub(reactRouter, 'useRouterHistory')
      .returns(createHistoryStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a store with setUpCommonFunctionality', () => {
    startApp({ entryName: 'testApp' });
    expect(setUpCommonFunctionalityStub.called).to.be.true;
  });

  it('should set up history with URL', () => {
    startApp({ entryName: 'testApp', url: '/foo' });
    expect(useRouterHistoryStub.calledWith(createHistoryStub)).to.be.true;
    expect(createHistoryStub.calledWith({ basename: '/foo' })).to.be.true;
  });

  it('should dispatch route updates', () => {
    startApp({ entryName: 'testApp', url: '/foo' });
    expect(storeStub.dispatch.calledWith(updateRouteStub())).to.be.true;
  });

  it('should render React component with routes', () => {
    const routes = <div>Routes</div>;
    startApp({ entryName: 'testApp', routes });
    expect(startReactAppStub.called).to.be.true;
  });

  it('should render React component with component', () => {
    const component = <div>Component</div>;
    startApp({ entryName: 'testApp', component });
    expect(startReactAppStub.called).to.be.true;
  });

  it('should return the store', () => {
    const result = startApp({ entryName: 'testApp' });
    expect(result).to.equal(storeStub);
  });
});
