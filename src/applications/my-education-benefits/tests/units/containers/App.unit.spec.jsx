import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import { setStoredSubTask } from 'platform/forms/sub-task';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import App from '../../../containers/App';
import responses from '../../../testing/responses';

const profile = {
  vapContactInfo: {
    ...responses['GET /meb_api/v0/claimant_info'],
  },
};

const fetchData = ({
  loggedIn = true,
  mockProfile = profile,
  savedForms = [],
  loading = false,
  verified = true,
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
        profile: { ...mockProfile, savedForms, verified },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
      },
      featureToggles: {
        loading,
      },
    },
  };
};

describe('App', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render visitor state', () => {
    setStoredSubTask({ benefitType: 'compensation' });
    const { props, data } = fetchData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} />
      </Provider>,
    );
    const article = $('#form-1990EZ', container);
    expect(article).to.exist;
    expect(article.getAttribute('data-location')).to.eq('introduction');
    expect($('h1', container).textContent).to.eq('Intro');
    expect($('va-loading-indicator', container)).to.not.exist;
  });
});
