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
import { SELECTED, CONTESTABLE_ISSUES_API } from '../../constants';
import { FETCH_CONTESTABLE_ISSUES_SUCCEEDED } from '../../actions';
import { contestableIssuesResponse } from '../fixtures/mocks/contestable-issues.json';

const getData = ({
  showNod = true,
  isLoading = false,
  loggedIn = true,
  formData = {},
  contestableIssues = { status: '' },
} = {}) => ({
  props: {
    loggedIn,
    showNod,
    location: { pathname: '/introduction', search: '' },
    children: <h1>Intro</h1>,
    // formData,
    router: { push: () => {} },
  },
  data: {
    featureToggles: {
      loading: isLoading,
      // eslint-disable-next-line camelcase
      form10182_nod: showNod,
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
        metadata: {},
      },
      data: formData,
    },
    contestableIssues,
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
  it('should render WIP alert', () => {
    const { props, data } = getData({ showNod: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <FormApp {...props} />
      </Provider>,
    );

    // FormTitle rendered separately in WIP page
    expect($('h1', container).textContent).to.contain('Board Appeal');
    expect($('va-alert', container).innerHTML).to.contain(
      'still working on this feature',
    );
  });

  it('should call API if logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    const { props, data } = getData();
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
    const { props, data } = getData();
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

  it('should set form data', async () => {
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
        contestableIssues: [],
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
      expect(action.data.contestableIssues.length).to.eq(1);
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
        contestableIssues: issues,
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
