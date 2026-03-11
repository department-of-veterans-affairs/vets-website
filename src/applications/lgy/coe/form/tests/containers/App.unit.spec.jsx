import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles/useFeatureToggle';

import App from '../../containers/App';
import { TOGGLE_KEY } from '../../constants';

const toggleSnakeKey = TOGGLE_NAMES[TOGGLE_KEY]; // 'coe_form_rebuild_cveteam'
const viewToggleKey = `view:${TOGGLE_KEY}`;

const getData = ({
  loggedIn = true,
  getCoeMock = () => {},
  showCOE = true,
  loading = false,
  toggleEnabled = false,
  formData = {},
} = {}) => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  return {
    props: {
      children: <div>children</div>,
      getCoe: () => {},
      getCoeMock,
      loggedIn,
      location: { pathname: '/introduction', search: '' },
    },
    mockStore: mockStore({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: loggedIn ? { claims: { coe: true } } : {},
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data: formData,
      },
      featureToggles: {
        loading,
        // eslint-disable-next-line camelcase
        coe_access: showCOE,
        [toggleSnakeKey]: toggleEnabled,
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: {
          get() {},
        },
        dismissedDowntimeWarnings: [],
      },
    }),
  };
};

describe('App', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <div>
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>
      </div>,
    );
    const article = $('#form-26-1880', container);
    expect(article).to.exist;
    expect(article.dataset.location).to.eq('introduction');
  });

  it('should render loading indicator', () => {
    const { props, mockStore } = getData({ loading: true });
    const { container } = render(
      <div>
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>
      </div>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render WIP alert', () => {
    const { props, mockStore } = getData({ showCOE: false });
    const { container } = render(
      <div>
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>
      </div>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h1', container).textContent).to.contain(
      'We’re still working on this feature',
    );
  });

  it.skip('should call API if logged in', async () => {
    const getCoeMock = sinon.spy();
    const { props, mockStore } = getData({ getCoeMock });
    render(
      <Provider store={mockStore}>
        <App {...props} />,
      </Provider>,
    );

    expect(getCoeMock.called).to.be.true;
    // not skipping generateCoe action
    expect(getCoeMock.args[0][0]).to.be.false;
  });
  it.skip('should not call API if not logged in', () => {
    const getCoeMock = sinon.spy();
    const { props, mockStore } = getData({ getCoeMock, loggedIn: false });
    render(
      <Provider store={mockStore}>
        <App {...props} />,
      </Provider>,
    );

    expect(getCoeMock.called).to.be.true;
    // we are skippingt generateCoe action
    expect(getCoeMock.args[0][0]).to.be.true;
  });
});

describe('feature toggle sync to formData', () => {
  it('dispatches SET_DATA with the view:-prefixed key when toggle is enabled', () => {
    const { props, mockStore } = getData({
      toggleEnabled: true,
      formData: {}, // no view:coeFormRebuildCveteam yet
    });

    render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const actions = mockStore.getActions();
    const setDataAction = actions.find(a => a.type === 'SET_DATA');
    expect(setDataAction).to.exist;
    expect(setDataAction.data[viewToggleKey]).to.be.true;
  });

  it('dispatches SET_DATA with false when toggle is disabled', () => {
    const { props, mockStore } = getData({
      toggleEnabled: false,
      formData: { [viewToggleKey]: true }, // was true, now toggle says false
    });

    render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const actions = mockStore.getActions();
    const setDataAction = actions.find(a => a.type === 'SET_DATA');
    expect(setDataAction).to.exist;
    expect(setDataAction.data[viewToggleKey]).to.be.false;
  });

  it('does not dispatch SET_DATA while feature flags are still loading', () => {
    const { props, mockStore } = getData({
      loading: true,
      toggleEnabled: true,
      formData: {}, // mismatched, but loading — should not sync
    });

    render(
      <Provider store={mockStore}>
        <App {...props} />
      </Provider>,
    );

    const actions = mockStore.getActions();
    const setDataAction = actions.find(a => a.type === 'SET_DATA');
    expect(setDataAction).to.not.exist;
  });
});
