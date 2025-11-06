import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import App from '../../containers/App';
import { HAS_VA_EVIDENCE } from '../../constants';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import { SELECTED } from '../../../shared/constants';
import {
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';
import { contestableIssuesResponse } from '../../../shared/tests/fixtures/mocks/contestable-issues.json';

const hasComp = { benefitType: 'compensation' };

const getData = ({
  loggedIn = true,
  savedForms = [],
  verified = true,
  data = hasComp,
  accountUuid = '',
  pathname = '/introduction',
  push = () => {},
  status = '',
} = {}) => {
  setStoredSubTask({ benefitType: data?.benefitType || '' });
  return {
    props: {
      location: { pathname, search: '' },
      children: <h1>Intro</h1>,
      router: { push },
      routes: [{ path: pathname }],
    },
    data: {
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: {
          get() {},
        },
        dismissedDowntimeWarnings: [],
      },
      routes: [{ path: pathname }],
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms,
          verified,
          accountUuid,
          prefillsAvailable: [],
        },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {
            inProgressFormId: '5678',
          },
        },
        data,
      },
      contestableIssues: {
        status,
      },
    },
  };
};

describe('App', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render logged out state', () => {
    const { props, data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );
    const article = $('#form-0995', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should render logged in state', () => {
    const { props, data } = getData({ loggedIn: false, status: 'done' });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );
    const article = $('#form-0995', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should not show contestable issue loading indicator on introduction page', () => {
    const { props, data } = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should redirect to start', () => {
    const push = sinon.spy();
    const { props, data } = getData({ push, data: {} });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    const alert = $('va-loading-indicator', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('message')).to.contain('restart the app');
    expect(push.calledWith('/start')).to.be.true;
  });

  it('should redirect to start for unsupported benefit types', () => {
    const push = sinon.spy();
    const { props, data } = getData({ push, data: { benefitType: 'other' } });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.contain(
      'restart the app',
    );
    expect(push.calledWith('/start')).to.be.true;
  });

  it('should not redirect to start for unsupported benefit types and already on the start page', () => {
    const push = sinon.spy();
    const { props, data } = getData({
      push,
      pathname: '/start',
      data: { benefitType: 'other' },
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.not.exist;
    expect(push.notCalled).to.be.true;
  });

  it('should update benefit type in form data', async () => {
    const { props, data } = getData({ loggedIn: true, data: {} });
    const store = mockStore(data);
    setStoredSubTask(hasComp);

    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );

    // testing issuesNeedUpdating branch for code coverage
    await waitFor(() => {
      const [action] = store.getActions();
      expect(action.type).to.eq(SET_DATA);
      expect(action.data).to.deep.equal(hasComp);
    });
  });

  it('should call contestable issues API if logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    const { props, data } = getData({
      data: { ...hasComp, internalTesting: true },
    });
    render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(global.fetch.args[0][0]).to.contain(CONTESTABLE_ISSUES_API);
      resetFetch();
    });
  });

  it('should update contested issues', async () => {
    const { props, data } = getData({
      loggedIn: true,
      data: {
        ...hasComp,
        internalTesting: true,
        contestedIssues: [
          {
            attributes: {
              ratingIssueSubjectText: 'test',
              approxDecisionDate: '2000-01-01',
            },
          },
        ],
      },
    });
    const contestableIssues = {
      status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      issues: [
        {
          attributes: {
            ratingIssueSubjectText: 'test',
            approxDecisionDate: '2000-01-02',
          },
        },
      ],
      legacyCount: 0,
    };
    const store = mockStore({ ...data, contestableIssues });

    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );

    // testing issuesNeedUpdating branch for code coverage
    await waitFor(() => {
      const [action] = store.getActions();
      expect(action.type).to.eq(SET_DATA);
      expect(action.data).to.deep.equal({
        ...hasComp,
        contestedIssues: [
          {
            attributes: {
              ratingIssueSubjectText: 'test',
              approxDecisionDate: '2000-01-02',
              description: '',
            },
          },
        ],
        legacyCount: 0,
        internalTesting: true,
      });
    });
  });

  it('should not update contestable issues when the API fails', async () => {
    const { props, data } = getData({
      loggedIn: true,
      data: {
        ...hasComp,
        internalTesting: true,
        contestedIssues: [
          {
            attributes: {
              ratingIssueSubjectText: 'test',
              approxDecisionDate: '2000-01-01',
            },
          },
        ],
      },
    });
    const contestableIssues = {
      status: FETCH_CONTESTABLE_ISSUES_FAILED,
      issues: [],
      legacyCount: undefined,
    };
    const store = mockStore({ ...data, contestableIssues });

    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );

    // testing issuesNeedUpdating branch for code coverage
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.length).to.eq(0);
    });
  });

  it('should update evidence', async () => {
    const { props, data } = getData({
      loggedIn: true,
      data: {
        ...hasComp,
        contestedIssues: [],
        legacyCount: 0,
        [HAS_VA_EVIDENCE]: true,
        locations: [{ issues: ['abc', 'def'] }],
        additionalIssues: [{ issue: 'bbb', [SELECTED]: true }],
        internalTesting: true,
      },
    });
    const contestableIssues = {
      status: 'done',
      issues: [],
      legacyCount: 0,
    };
    const store = mockStore({ ...data, contestableIssues });

    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );

    // testing update evidence (evidenceNeedsUpdating) branch for code coverage
    await waitFor(() => {
      const [action] = store.getActions();
      expect(action.type).to.eq(SET_DATA);
      expect(action.data).to.deep.equal({
        ...data.form.data,
        providerFacility: [],
        locations: [{ issues: [] }],
      });
    });
  });
});
