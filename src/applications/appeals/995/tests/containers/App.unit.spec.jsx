import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

import { setStoredSubTask } from 'platform/forms/sub-task';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import App from '../../containers/App';

import { EVIDENCE_VA } from '../../constants';
import { SELECTED } from '../../../shared/constants';

const hasComp = { benefitType: 'compensation' };

const getData = ({
  loggedIn = true,
  savedForms = [],
  verified = true,
  data = hasComp,
  accountUuid = '',
  push = () => {},
} = {}) => {
  setStoredSubTask({ benefitType: data?.benefitType || '' });
  return {
    props: {
      location: { pathname: '/introduction', search: '' },
      children: <h1>Intro</h1>,
      router: { push },
    },
    data: {
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms,
          verified,
          accountUuid,
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
        status: '',
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
    const { props, data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider
        store={mockStore({ ...data, contestableIssues: { status: 'done' } })}
      >
        <App {...props} />
      </Provider>,
    );
    const article = $('#form-0995', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should show contestable issue loading indicator', () => {
    const { props, data } = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    expect(
      $('va-loading-indicator', container).getAttribute('message'),
    ).to.contain('Loading your previous decision');
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

    const alert = $('va-loading-indicator', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('message')).to.contain('restart the app');
    expect(push.calledWith('/start')).to.be.true;
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
      expect(action.type).to.eq('SET_DATA');
      expect(action.data).to.deep.equal(hasComp);
    });
  });

  it('should update contestable issues', async () => {
    const { props, data } = getData({ loggedIn: true });
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

    // testing issuesNeedUpdating branch for code coverage
    await waitFor(() => {
      const [action] = store.getActions();
      expect(action.type).to.eq('SET_DATA');
      expect(action.data).to.deep.equal({
        ...hasComp,
        contestedIssues: [],
        legacyCount: 0,
      });
    });
  });

  it('should update evidence', async () => {
    const { props, data } = getData({ loggedIn: true });
    const contestableIssues = {
      status: 'done',
      issues: [],
      legacyCount: 0,
    };
    data.form.data = {
      ...hasComp,
      contestedIssues: [],
      legacyCount: 0,
      [EVIDENCE_VA]: true,
      locations: [{ issues: ['abc', 'def'] }],
      additionalIssues: [{ issue: 'bbb', [SELECTED]: true }],
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
      expect(action.type).to.eq('SET_DATA');
      expect(action.data).to.deep.equal({
        ...data.form.data,
        providerFacility: [],
        locations: [{ issues: [] }],
      });
    });
  });

  it('should set Sentry tags with account UUID & in progress ID', async () => {
    const { props, data } = getData({ accountUuid: 'abcd-5678' });
    const store = mockStore(data);

    const setTag = sinon.stub(Sentry, 'setTag');
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(setTag.args[0]).to.deep.equal(['account_uuid', 'abcd-5678']);
      expect(setTag.args[1]).to.deep.equal(['in_progress_form_id', '5678']);
      setTag.restore();
    });
  });
});
