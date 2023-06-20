import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { RoutedSavableApp } from '../../save-in-progress/RoutedSavableApp';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
} from '../../save-in-progress/actions';

let oldAddEventListener;
const location = {
  pathname: '/',
};
const wizardStorageKey = 'testKey';

const setup = () => {
  oldAddEventListener = global.window.addEventListener;

  global.window.addEventListener = () => {};
};

const teardown = () => {
  global.window.addEventListener = oldAddEventListener;
  global.window.sessionStorage.removeItem(wizardStorageKey);
};

describe('Schemaform <RoutedSavableApp>', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('should render children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.notAttempted}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should render the loading screen', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(tree.everySubTree('va-loading-indicator')).not.to.be.empty;
  });
  it('should route when prefill unfilled', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          {
            path: '/introduction',
          },
          {
            path: '/test-path',
          },
        ],
      },
    ];
    const router = {
      push: sinon.spy(),
    };

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      prefillStatus: PREFILL_STATUSES.unfilled,
      router,
      routes,
      data: {},
    });

    expect(router.push.calledWith('/test-path')).to.be.true;
  });
  it('should route to restartFormCallback destination when prefill unfilled (on form restart)', () => {
    const restartDestination = '/test-page';
    sessionStorage.setItem(wizardStorageKey, 'restarting');

    const formConfig = {
      title: 'Testing',
      wizardStorageKey,
      saveInProgress: {
        restartFormCallback: () => restartDestination,
      },
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          {
            path: '/introduction',
          },
          {
            path: '/test-path',
          },
        ],
      },
    ];
    const router = {
      push: sinon.spy(),
    };

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      prefillStatus: PREFILL_STATUSES.unfilled,
      router,
      routes,
      data: {},
      isStartingOver: true, // flag set by FormStartControls
      formConfig,
    });

    expect(router.push.firstCall.args[0]).to.equal(restartDestination);
    expect(sessionStorage.getItem(wizardStorageKey)).to.equal('restarted');
  });

  it('should route and reset fetch status on success', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: '/test-path',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];
    const router = {
      push: sinon.spy(),
    };
    const returnUrl = '/test-path';
    const setFetchFormStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      formConfig,
      router,
      routes,
      returnUrl,
      loadedStatus: LOAD_STATUSES.success,
      setFetchFormStatus,
    });

    expect(router.push.calledWith(returnUrl)).to.be.true;
    expect(setFetchFormStatus.calledWith(LOAD_STATUSES.notAttempted)).to.be
      .true;
  });
  it('should route to error when failed', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];
    const router = {
      push: sinon.spy(),
    };

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      router,
      loadedStatus: LOAD_STATUSES.failure,
      formConfig: { urlPrefix: '/' },
    });

    expect(router.push.calledWith('/error')).to.be.true;
  });
  it('should route to the first page if started in the middle and not logged in', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          { path: '/introduction' },
          { path: currentLocation.pathname }, // You are here
          { path: '/lastPage' },
        ],
      },
    ];
    const router = {
      replace: sinon.spy(),
    };

    // Only redirects in production or if ?redirect is in the URL
    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().componentDidMount();

    expect(router.replace.calledWith('/introduction')).to.be.true;
  });
  it('should route to the first page if returnUrl is not to an active page', () => {
    const formConfig = {
      title: 'Testing',
    };
    const currentLocation = {
      pathname: '/test-path',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];
    const router = {
      push: sinon.spy(),
    };
    const returnUrl = '/test-99';
    const setFetchFormStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      formConfig,
      router,
      routes,
      returnUrl,
      loadedStatus: LOAD_STATUSES.success,
      setFetchFormStatus,
    });

    expect(router.push.calledWith(currentLocation.pathname)).to.be.true;
  });
  it('should load a saved form when starting in the middle of a form and logged in', () => {
    const formConfig = {
      title: 'Testing',
      formId: 'testForm',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          { path: '/introduction' },
          { path: currentLocation.pathname }, // You are here
          { path: '/lastPage' },
        ],
      },
    ];
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };
    const fetchInProgressForm = sinon.spy();

    // Only redirects in production or if ?redirect is in the URL
    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      profileIsLoading: false,
      isLoggedIn: true,
      savedForms: [{ form: formConfig.formId }],
      prefillsAvailable: [],
      formConfig,
      router,
      routes,
      fetchInProgressForm,
    });

    expect(
      fetchInProgressForm.calledWith(
        formConfig.formId,
        formConfig.migrations,
        false,
      ),
    ).to.be.true;
  });
  it('should load a pre-filled form when starting in the middle of a form and logged in', () => {
    const formConfig = {
      title: 'Testing',
      formId: 'testForm',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          { path: '/introduction' },
          { path: currentLocation.pathname }, // You are here
          { path: '/lastPage' },
        ],
      },
    ];
    const router = {
      replace: sinon.spy(),
      push: sinon.spy(),
    };
    const fetchInProgressForm = sinon.spy();

    // Only redirects in production or if ?redirect is in the URL
    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      profileIsLoading: false,
      isLoggedIn: true,
      savedForms: [],
      prefillsAvailable: [formConfig.formId],
      formConfig,
      router,
      routes,
      fetchInProgressForm,
    });

    expect(
      fetchInProgressForm.calledWith(
        formConfig.formId,
        formConfig.migrations,
        true,
      ),
    ).to.be.true;
  });
  it('should skip pre-fill when skipPrefill is true', () => {
    const formConfig = {
      title: 'Testing',
      formId: 'testForm',
    };
    const currentLocation = {
      pathname: 'test',
      search: '',
    };
    const routes = [
      { path: '/' },
      {
        pageList: [
          { path: '/introduction' },
          { path: '/first-in-form-page' },
          { path: currentLocation.pathname }, // You are here
          { path: '/lastPage' },
        ],
      },
    ];
    const router = {
      replace: sinon.spy(),
      push: sinon.spy(),
    };
    const fetchInProgressForm = sinon.spy();

    // Only redirects in production or if ?redirect is in the URL
    const tree = SkinDeep.shallowRender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      profileIsLoading: false,
      isLoggedIn: true,
      skipPrefill: true,
      savedForms: [],
      prefillsAvailable: [formConfig.formId],
      formConfig,
      router,
      routes,
      fetchInProgressForm,
    });

    expect(fetchInProgressForm.called).to.be.false;
    expect(router.replace.calledWith('/first-in-form-page')).to.be.true;
  });
});
