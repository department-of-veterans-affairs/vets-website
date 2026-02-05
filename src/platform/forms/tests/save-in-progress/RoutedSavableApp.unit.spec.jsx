import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import { RoutedSavableApp } from '../../save-in-progress/RoutedSavableApp';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
} from '../../save-in-progress/actions';

let oldAddEventListener;
const location = {
  pathname: '/',
  href: '/',
  search: '',
  hash: '',
};
const wizardStorageKey = 'testKey';

// Mock FormApp to prevent rendering errors
const MockFormApp = ({ children }) => (
  <div className="mock-form-app">{children}</div>
);

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

    const { container } = render(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.notAttempted}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(container.querySelectorAll('.child').length).to.be.greaterThan(0);
    expect(container.querySelectorAll('FormNav').length).to.equal(0);
    expect(container.querySelectorAll('FormTitle').length).to.equal(0);
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
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };

    const { container } = render(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus="notAttempted"
        savedStatus="notAttempted"
        autoSavedStatus="notAttempted"
        updateLogInUrl={() => {}}
        formData={{}}
        isLoggedIn={false}
        savedForms={[]}
        prefillsAvailable={[]}
        profileIsLoading={false}
        isStartingOver={false}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(
      container.querySelectorAll('va-loading-indicator').length,
    ).to.be.greaterThan(0);
  });
  it('should route when prefill unfilled', () => {
    // NOTE: This test originally tested UNSAFE_componentWillReceiveProps directly.
    // With RTL, we can only test rendering behavior. For this lifecycle-dependent logic,
    // we verify the component renders correctly with different prefill states.
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
      replace: sinon.spy(),
    };

    const { rerender } = render(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.pending}
        updateLogInUrl={() => {}}
        data={{}}
        formData={{}}
        savedStatus="notAttempted"
        autoSavedStatus="notAttempted"
        isLoggedIn={false}
        savedForms={[]}
        prefillsAvailable={[]}
        profileIsLoading={false}
        isStartingOver={false}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // Simulate prop change by rerendering with new props
    rerender(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.unfilled}
        updateLogInUrl={() => {}}
        data={{}}
        formData={{}}
        savedStatus="notAttempted"
        autoSavedStatus="notAttempted"
        isLoggedIn={false}
        savedForms={[]}
        prefillsAvailable={[]}
        profileIsLoading={false}
        isStartingOver={false}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
      replace: sinon.spy(),
    };

    const { rerender } = render(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.pending}
        updateLogInUrl={() => {}}
        data={{}}
        formData={{}}
        savedStatus="notAttempted"
        autoSavedStatus="notAttempted"
        isLoggedIn={false}
        savedForms={[]}
        prefillsAvailable={[]}
        profileIsLoading={false}
        isStartingOver={false}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    rerender(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        prefillStatus={PREFILL_STATUSES.unfilled}
        updateLogInUrl={() => {}}
        data={{}}
        isStartingOver
        formData={{}}
        savedStatus="notAttempted"
        autoSavedStatus="notAttempted"
        isLoggedIn={false}
        savedForms={[]}
        prefillsAvailable={[]}
        profileIsLoading={false}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
      replace: sinon.spy(),
    };
    const returnUrl = '/test-path';
    const setFetchFormStatus = sinon.spy();

    const { rerender } = render(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
        setFetchFormStatus={setFetchFormStatus}
        formData={{}}
        savedStatus="notAttempted"
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    rerender(
      <RoutedSavableApp
        location={location}
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.success}
        returnUrl={returnUrl}
        updateLogInUrl={() => {}}
        setFetchFormStatus={setFetchFormStatus}
        formData={{}}
        savedStatus="notAttempted"
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(router.push.calledWith(returnUrl)).to.be.true;
    expect(setFetchFormStatus.calledWith(LOAD_STATUSES.notAttempted)).to.be
      .true;
  });
  it('should route to error when failed', () => {
    const formConfig = {
      title: 'Testing',
      urlPrefix: '/',
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
      replace: sinon.spy(),
    };

    const { rerender } = render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
        formData={{}}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    rerender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.failure}
        updateLogInUrl={() => {}}
        formData={{}}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
    render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // componentDidMount is called automatically by RTL render
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
      replace: sinon.spy(),
    };
    const returnUrl = '/test-99';
    const setFetchFormStatus = sinon.spy();

    const { rerender } = render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.pending}
        updateLogInUrl={() => {}}
        setFetchFormStatus={setFetchFormStatus}
        formData={{}}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    rerender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        loadedStatus={LOAD_STATUSES.success}
        returnUrl={returnUrl}
        updateLogInUrl={() => {}}
        setFetchFormStatus={setFetchFormStatus}
        formData={{}}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
    const { rerender } = render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[]}
        prefillsAvailable={[]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    rerender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading={false}
        isLoggedIn
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[{ form: formConfig.formId }]}
        prefillsAvailable={[]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
    const { rerender } = render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[]}
        prefillsAvailable={[]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    rerender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading={false}
        isLoggedIn
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[]}
        prefillsAvailable={[formConfig.formId]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

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
    const { rerender } = render(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[]}
        prefillsAvailable={[]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    // When logged in, the component gets mounted before the profile is finished
    //  loading, so the logic is in componentWillReceiveProps()
    rerender(
      <RoutedSavableApp
        formConfig={formConfig}
        routes={routes}
        router={router}
        currentLocation={currentLocation}
        profileIsLoading={false}
        isLoggedIn
        skipPrefill
        loadedStatus={LOAD_STATUSES.pending}
        fetchInProgressForm={fetchInProgressForm}
        savedForms={[]}
        prefillsAvailable={[formConfig.formId]}
        FormApp={MockFormApp}
      >
        <div className="child" />
      </RoutedSavableApp>,
    );

    expect(fetchInProgressForm.called).to.be.false;
    expect(router.replace.calledWith('/first-in-form-page')).to.be.true;
  });
});
