import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { RoutedSavableSinglePageFormApp } from '../../../0993/containers/RoutedSavableSinglePageFormApp';
import { LOAD_STATUSES, PREFILL_STATUSES } from '../../../../../platform/forms/save-in-progress/actions';

let oldWindow;

const setup = () => {
  oldWindow = global.window;

  global.window = {
    ...oldWindow,
    location: {
      pathname: '/',
    },
    addEventListener: () => {},
  };
};

const teardown = () => {
  global.window = oldWindow;
};

describe('Schemaform <RoutedSavableSinglePageFormApp>', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('should render children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'confirmation',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.notAttempted}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should render the loading screen', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
  it('should route when prefill unfilled', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{
        path: 'intro'
      }, {
        path: 'test-path'
      }]
    }];
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.pending}
        updateLogInUrl={() => {}}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
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
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];
    const router = {
      push: sinon.spy()
    };
    const returnUrl = 'test-path';
    const setFetchFormStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
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
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      router,
      loadedStatus: LOAD_STATUSES.failure,
      formConfig: { urlPrefix: '/' }
    });

    expect(router.push.calledWith('/error')).to.be.true;
  });
  it('should not load form if not on form’s single page', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: '/confirmation',
      search: ''
    };
    const routes = [{
      pageList: [
        { path: '/claimant-information' },
        { path: currentLocation.pathname }, // You are here
        { path: '/lastPage' }
      ]
    }];
    const router = {
      replace: sinon.spy()
    };
    const fetchInProgressForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    tree.getMountedInstance().componentDidMount();

    expect(fetchInProgressForm.calledWith(formConfig.formId, formConfig.migrations, false))
      .to.be.false;
  });
  it('should not load form if on form’s single page and not logged in', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [
        { path: currentLocation.pathname }, // You are here
        { path: '/lastPage' }
      ]
    }];
    const router = {
      replace: sinon.spy()
    };
    const fetchInProgressForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    tree.getMountedInstance().componentDidMount();

    expect(fetchInProgressForm.calledWith(formConfig.formId, formConfig.migrations, false))
      .to.be.false;
  });
  it('should load a saved form when on the form’s single page and logged in', () => {
    const formConfig = {
      title: 'Testing',
      formId: 'testForm'
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [
        { path: currentLocation.pathname }, // You are here
        { path: '/lastPage' }
      ]
    }];
    const router = {
      push: sinon.spy(),
      replace: sinon.spy()
    };
    const fetchInProgressForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    tree.getMountedInstance().componentWillReceiveProps({
      profileIsLoading: false,
      isLoggedIn: true,
      savedForms: [{ form: formConfig.formId }],
      prefillsAvailable: [],
      formConfig,
      router,
      routes,
      fetchInProgressForm
    });

    expect(fetchInProgressForm.calledWith(formConfig.formId, formConfig.migrations, false))
      .to.be.true;
  });
  it('should load a pre-filled form when logged in at the form’s single page', () => {
    const formConfig = {
      title: 'Testing',
      formId: 'testForm'
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [
        { path: currentLocation.pathname }, // You are here
        { path: '/lastPage' }
      ]
    }];
    const router = {
      replace: sinon.spy(),
      push: sinon.spy()
    };
    const fetchInProgressForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableSinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}>
        <div className="child"/>
      </RoutedSavableSinglePageFormApp>
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    tree.getMountedInstance().componentWillReceiveProps({
      profileIsLoading: false,
      isLoggedIn: true,
      savedForms: [],
      prefillsAvailable: [formConfig.formId],
      formConfig,
      router,
      routes,
      fetchInProgressForm
    });

    expect(fetchInProgressForm.calledWith(formConfig.formId, formConfig.migrations, true))
      .to.be.true;
  });
});

