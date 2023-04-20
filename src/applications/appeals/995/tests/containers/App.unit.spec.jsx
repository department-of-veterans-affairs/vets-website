import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { setStoredSubTask } from 'platform/forms/sub-task';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import App from '../../containers/App';

const profile = {
  vapContactInfo: {
    email: {
      emailAddress: 'test@user.com',
    },
    homePhone: {
      countryCode: '2',
      areaCode: '345',
      phoneNumber: '6789013',
      phoneNumberExt: '34',
      updatedAt: '2021-01-01',
    },
    mobilePhone: {
      countryCode: '2',
      areaCode: '345',
      phoneNumber: '6789012',
      phoneNumberExt: '',
      updatedAt: '2021-01-01',
    },
    mailingAddress: {
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode: '10101',
      countryName: 'USA',
      internationalPostalCode: '12345',
      updatedAt: '2021-01-01',
    },
  },
};

const saved0995 = [
  {
    form: VA_FORM_IDS.FORM_20_0995,
    metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
  },
];

const getData = ({
  loggedIn = true,
  mockProfile = profile,
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
          ...mockProfile,
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

  it('should not throw an error if profile is null', () => {
    const mockProfile = {
      vapContactInfo: {
        email: null,
        homePhone: null,
        mobilePhone: null,
        mailingAddress: null,
      },
    };
    const { props, data } = getData({
      mockProfile,
      savedForms: saved0995,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.exist;
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
