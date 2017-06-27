import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { FormApp } from '../../../src/js/common/schemaform/FormApp';
import { LOAD_STATUSES, PREFILL_STATUSES } from '../../../src/js/common/schemaform/save-load-actions';

describe('Schemaform <FormApp>', () => {
  it('should render children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.notAttempted}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should render nav and children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'test'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.notAttempted}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });
  it('should render form title', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.notAttempted}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('FormTitle')).not.to.be.empty;
  });
  it('should render the loading screen', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.pending}
          isLoggedIn
          updateLogInUrl={() => {}}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
  it('should route when prefill unfilled', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };
    const routes = [{
      pageList: [{}, {
        path: 'test-path'
      }]
    }];
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.pending}
          prefillStatus={PREFILL_STATUSES.pending}
          isLoggedIn
          updateLogInUrl={() => {}}>
        <div className="child"/>
      </FormApp>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      prefillStatus: PREFILL_STATUSES.unfilled,
      router,
      routes
    });

    expect(router.push.calledWith('test-path')).to.be.true;
  });
  it('should route and reset fetch status on success', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };
    const router = {
      push: sinon.spy()
    };
    const returnUrl = 'test-path';
    const setFetchFormStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.pending}
          isLoggedIn
          updateLogInUrl={() => {}}>
        <div className="child"/>
      </FormApp>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      router,
      returnUrl,
      loadedStatus: LOAD_STATUSES.success,
      setFetchFormStatus
    });

    expect(router.push.calledWith(returnUrl)).to.be.true;
    expect(setFetchFormStatus.calledWith(LOAD_STATUSES.notAttempted)).to.be.true;
  });
  it('should route to error when failed', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}
          loadedStatus={LOAD_STATUSES.pending}
          isLoggedIn
          updateLogInUrl={() => {}}>
        <div className="child"/>
      </FormApp>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      router,
      loadedStatus: LOAD_STATUSES.failure,
      formConfig: { urlPrefix: '/' }
    });

    expect(router.push.calledWith('/error')).to.be.true;
  });
});
