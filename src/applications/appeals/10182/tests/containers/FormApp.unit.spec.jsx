import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import FormApp from '../../containers/FormApp';
import { CONTESTABLE_ISSUES_API } from '../../constants';

import {
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';
import { contestableIssuesResponse } from '../../../shared/tests/fixtures/mocks/contestable-issues.json';
import { SELECTED } from '../../../shared/constants';
import { getRandomDate } from '../../../shared/tests/cypress.helpers';

const getData = ({
  isLoading = false,
  loggedIn = true,
  formData = {},
  contestableIssues = { status: '' },
  returnUrl = '/veteran-details',
  isStartingOver = false,
} = {}) => ({
  props: {
    loggedIn,
    location: { pathname: '/introduction', search: '' },
    children: <h1>Intro</h1>,
    // formData,
    router: { push: () => {} },
  },
  data: {
    featureToggles: {
      loading: isLoading,
    },
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: true,
      },
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {
          returnUrl,
        },
      },
      data: formData,
    },
    contestableIssues,
    isStartingOver,
  },
});

describe('FormApp', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render', () => {
    const { props, data } = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
      </Provider>,
    );
    const article = $('#form-10182', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');

    // FormTitle rendered in children
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });
  it('should render loading indicator', () => {
    const { props, data } = getData({ isLoading: true });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
      </Provider>,
    );

    expect(
      $('va-loading-indicator', container).getAttribute('message'),
    ).to.contain('Loading application');
  });

  it('should call API if logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    const { props, data } = getData({ formData: { internalTesting: true } });
    render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
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
    render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(global.fetch.notCalled).to.be.true;
      resetFetch();
    });
  });

  it('should call API when logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    const { props, data } = getData({
      formData: { internalTesting: true },
    });
    render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(global.fetch.called).to.be.true;
      resetFetch();
    });
  });

  it('should update contested issues', async () => {
    const issues = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test1',
          approxDecisionDate: getRandomDate(),
        },
      },
    ];
    const { props, data } = getData({
      contestableIssues: {
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues,
      },
      formData: {
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'test1',
              approxDecisionDate: '2023-11-01',
            },
          },
        ],
        areaOfDisagreement: [{}],
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <FormApp {...props} />
      </Provider>,
    );

    await waitFor(() => {
      // Here, we are checking the second action, which is dispatched within the
      // second `useEffect` in `FormApp`. This second `useEffect` is the one that
      // manages contestable issues.
      const action = store.getActions()[1];
      expect(action.type).to.eq(SET_DATA);
      expect(action.data.contestedIssues.length).to.eq(1);
      expect(action.data.contestedIssues).to.deep.equal([
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'test1',
            approxDecisionDate: issues[0].attributes.approxDecisionDate,
            description: '',
          },
        },
      ]);
    });
  });

  it('should not update contested issues when the API fails', async () => {
    const { props, data } = getData({
      contestableIssues: {
        status: FETCH_CONTESTABLE_ISSUES_FAILED,
        issues: [],
      },
      formData: {
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'test1',
              approxDecisionDate: '2023-11-01',
            },
          },
        ],
        areaOfDisagreement: [],
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <FormApp {...props} />
      </Provider>,
    );

    await waitFor(() => {
      // Here, we are checking the second action, which is dispatched within the
      // second `useEffect` in `FormApp`. This second `useEffect` is the one that
      // manages contestable issues.
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
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues,
      },
      formData: {
        contestedIssues: issues,
        areaOfDisagreement: [],
        additionalIssues: [{ issue: 'test2', [SELECTED]: true }],
      },
    });
    const store = mockStore(data);

    render(
      <Provider store={store}>
        <FormApp {...props} />
      </Provider>,
    );

    await waitFor(() => {
      const action = store.getActions()[0];
      expect(action.type).to.eq(SET_DATA);
      expect(action.data.areaOfDisagreement.length).to.eq(2);
    });
  });
});
