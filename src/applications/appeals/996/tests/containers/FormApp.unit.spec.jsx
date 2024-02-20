import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Form0996App from '../../containers/Form0996App';
import { setHlrWizardStatus, removeHlrWizardStatus } from '../../wizard/utils';
import { CONTESTABLE_ISSUES_API } from '../../constants';
import { SELECTED } from '../../../shared/constants';
import { FETCH_CONTESTABLE_ISSUES_SUCCEEDED } from '../../actions';

import maximalTestV1 from '../fixtures/data/maximal-test-v1.json';
import migratedMaximalTestV1 from '../fixtures/data/migrated/maximal-test-v1-to-v2.json';
import { contestableIssuesResponse } from '../../../shared/tests/fixtures/mocks/contestable-issues.json';

const savedHlr = [
  {
    form: VA_FORM_IDS.FORM_20_0996,
    metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
  },
];

const getData = ({
  loggedIn = true,
  savedForms = [],
  formData = { benefitType: 'compensation' },
  contestableIssues = { status: '' },
  routerPush = () => {},
} = {}) => ({
  props: {
    loggedIn,
    location: { pathname: '/introduction', search: '' },
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
});

describe('Form0996App', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    const article = $('#form-0996', container);
    expect(article).to.exist;
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

  it('should redirect to /start', () => {
    removeHlrWizardStatus();
    const routerPushSpy = sinon.spy();
    const { props, data } = getData({
      savedForms: savedHlr,
      routerPush: routerPushSpy,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.contain('restart');
    expect(routerPushSpy.called).to.be.true;
    expect(routerPushSpy.args[0][0]).to.eq('/start');
  });

  it('should call API is logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);

    const { props, data } = getData({ savedForms: savedHlr });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <Form0996App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.exist;
      expect(global.fetch.args[0][0]).to.contain(CONTESTABLE_ISSUES_API);
      resetFetch();
    });
  });

  it('should not call API if not logged in', async () => {
    mockApiRequest(contestableIssuesResponse);
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);

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

  it('should set form data', async () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
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
      savedForms: savedHlr,
      contestableIssues: {
        benefitType: 'compensation',
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        issues,
        legacyCount: 0,
      },
      formData: {
        benefitType: 'compensation',
        contestedIssues: [],
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
      expect(action.type).to.eq(SET_DATA);
      expect(action.data.contestedIssues.length).to.eq(1);
    });
  });

  it('should update areaOfDisagreement from selected issues', async () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
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
      savedForms: savedHlr,
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
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
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
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, data } = getData({
      savedForms: savedHlr,
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
      expect(action.data).to.deep.equal(migratedMaximalTestV1);
    });
  });
});
