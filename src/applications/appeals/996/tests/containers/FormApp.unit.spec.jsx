import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import { mockApiRequest, resetFetch } from '~/platform/testing/unit/helpers';
import { SET_DATA } from '~/platform/forms-system/src/js/actions';

import Form0996App from '../../containers/Form0996App';
import { CONTESTABLE_ISSUES_API } from '../../constants';

import maximalTestV1 from '../fixtures/data/maximal-test-v1.json';
import migratedMaximalTestV1 from '../fixtures/data/migrated/maximal-test-v1-to-v2.json';

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
  formData = hasComp,
  contestableIssues = { status: '' },
  pathname = '/introduction',
  routerPush = () => {},
} = {}) => {
  setStoredSubTask({ benefitType: formData?.benefitType || '' });
  return {
    props: {
      loggedIn,
      location: { pathname, search: '' },
      children: <h1>Intro</h1>,
      router: { push: routerPush },
    },
    data: {
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms,
          prefillsAvailable: [],
          verified: true,
        },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data: formData,
      },
      contestableIssues,
    },
  };
};

describe('Form0996App', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render logged out state', () => {
    const { props, data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    const article = $('#form-0996', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');

    // FormTitle rendered in children
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should render with no data', () => {
    const { props, data } = getData();
    const minimalData = {
      ...data,
      user: {
        ...data.user,
        profile: {},
      },
      form: {
        ...data.form,
        data: undefined,
      },
      contestableIssues: undefined,
    };
    const { container } = render(
      <Provider store={mockStore(minimalData)}>
        <Form0996App {...props} />
      </Provider>,
    );
    expect($('#form-0996', container)).to.exist;
  });

  it('should redirect to start for unsupported benefit types', () => {
    const routerPushSpy = sinon.spy();
    const { props, data } = getData({
      routerPush: routerPushSpy,
      formData: { benefitType: 'other' },
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.contain('restart');
    expect(routerPushSpy.calledWith('/start')).to.be.true;
  });

  it('should not redirect to /start if already on the start page', () => {
    const routerPushSpy = sinon.spy();
    const { props, data } = getData({
      pathname: '/start',
      routerPush: routerPushSpy,
      formData: { benefitType: 'other' },
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.not.exist;
    expect(routerPushSpy.notCalled).to.be.true;
  });

  it('should call API is logged in', async () => {
    mockApiRequest(contestableIssuesResponse);

    const { props, data } = getData({
      formData: { benefitType: 'compensation', internalTesting: true },
    });
    render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(global.fetch.args[0][0]).to.contain(CONTESTABLE_ISSUES_API);
      resetFetch();
    });
  });

  it('should not call API if not logged in', async () => {
    mockApiRequest(contestableIssuesResponse);

    const { props, data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.not.exist;
      expect(global.fetch.notCalled).to.be.true;
      resetFetch();
    });
  });

  it('should update benefit type in form data', async () => {
    const { props, data } = getData({ loggedIn: true, formData: {} });
    const store = mockStore(data);
    setStoredSubTask(hasComp);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    // testing issuesNeedUpdating branch for code coverage
    await waitFor(() => {
      const [action] = store.getActions();
      expect(action.type).to.eq('SET_DATA');
      expect(action.data).to.deep.equal(hasComp);
    });
  });

  it('should update contested issues', async () => {
    const issues = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test1',
          approxDecisionDate: '2023-06-07',
        },
      },
    ];
    const { props, data } = getData({
      contestableIssues: {
        benefitType: 'compensation',
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues,
        legacyCount: 0,
      },
      formData: {
        benefitType: 'compensation',
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'test1',
              approxDecisionDate: '2023-06-06',
            },
            [SELECTED]: true,
          },
        ],
        legacyCount: 0,
        internalTesting: true,
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const action = store.getActions()[0];
      expect(action.type).to.eq(SET_DATA);
      expect(action.data.contestedIssues.length).to.eq(1);
      expect(action.data).to.deep.equal({
        ...hasComp,
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'test1',
              approxDecisionDate: '2023-06-07',
              description: '',
            },
          },
        ],
        legacyCount: 0,
        internalTesting: true,
      });
    });
  });

  it('should not update contested issues when the API fails', async () => {
    const { props, data } = getData({
      contestableIssues: {
        benefitType: 'compensation',
        status: FETCH_CONTESTABLE_ISSUES_FAILED,
        issues: [],
        legacyCount: undefined,
      },
      formData: {
        benefitType: 'compensation',
        areaOfDisagreement: [],
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'test1',
              approxDecisionDate: '2023-06-06',
            },
          },
        ],
        legacyCount: 0,
        internalTesting: true,
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.length).to.eq(0);
    });
  });

  it('should update areaOfDisagreement from selected issues', async () => {
    const issues = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test1',
          approxDecisionDate: '2023-06-06',
        },
        [SELECTED]: true,
      },
    ];
    const { props, data } = getData({
      contestableIssues: {
        benefitType: 'compensation',
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues,
        legacyCount: 0,
      },
      formData: {
        benefitType: 'compensation',
        contestedIssues: issues,
        areaOfDisagreement: [],
        additionalIssues: [{ issue: 'test2', [SELECTED]: true }],
        legacyCount: 0,
        internalTesting: true,
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const action = store.getActions()[0];
      expect(action.type).to.eq(SET_DATA);
      expect(action.data.areaOfDisagreement.length).to.eq(2);
    });
  });

  it('should not update areaOfDisagreement', async () => {
    const issues = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test2',
          approxDecisionDate: '2023-06-06',
        },
        [SELECTED]: true,
      },
    ];
    const additionalIssues = [
      {
        issue: 'test2',
        decisionDate: '2023-07-07',
        [SELECTED]: true,
      },
    ];
    const { props, data } = getData({
      contestableIssues: {
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        benefitType: 'compensation',
        issues,
        legacyCount: 0,
      },
      formData: {
        contestedIssues: issues,
        benefitType: 'compensation',
        areaOfDisagreement: [issues[0], additionalIssues[0]],
        additionalIssues,
        legacyCount: 0,
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const action = store.getActions()[0];
      expect(action).to.be.undefined;
    });
  });

  it('should force transform of v1 data', async () => {
    const { props, data } = getData({
      contestableIssues: {
        benefitType: 'compensation',
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues: maximalTestV1.data.contestedIssues,
        legacyCount: 0,
      },
      formData: {
        ...maximalTestV1.data,
        benefitType: 'compensation',
        contestedIssues: [],
        legacyCount: 0,
        internalTesting: true,
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const action = store.getActions()[0];
      expect(action.type).to.eq(SET_DATA);
      expect(action.data).to.deep.equal({
        ...migratedMaximalTestV1,
        internalTesting: true,
      });
    });
  });
});
