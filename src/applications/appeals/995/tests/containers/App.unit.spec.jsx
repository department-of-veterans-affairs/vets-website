import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';

import { setStoredSubTask } from 'platform/forms/sub-task';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import App from '../../containers/App';

const getData = ({
  loggedIn = true,
  savedForms = [],
  loading = false,
  verified = true,
  show995 = true,
  data = { benefitType: 'compensation' },
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
          accountUuid: 'abcd-5678',
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
      featureToggles: {
        loading,
        // eslint-disable-next-line camelcase
        supplemental_claim: show995,
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
    setStoredSubTask({ benefitType: 'compensation' });
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
    setStoredSubTask({ benefitType: 'compensation' });
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

  it('should show feature toggles loading indicator', () => {
    const { props, data } = getData({ loading: true });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    expect(
      $('va-loading-indicator', container).getAttribute('message'),
    ).to.contain('Loading application');
  });

  it('should show WIP alert when feature is disabled', () => {
    const { props, data } = getData({ show995: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('still working on this feature');
  });

  it('should show contestable issue loading indicator', () => {
    setStoredSubTask({ benefitType: 'compensation' });
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
});
