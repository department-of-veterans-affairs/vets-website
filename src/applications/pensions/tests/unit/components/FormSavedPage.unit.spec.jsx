import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import FormSavedPage from '../../../components/FormSavedPage';
import formConfig from '../../../config/form';

describe('<FormSavedPage />', () => {
  const { formId } = formConfig;
  const path = '/applicant/mail-address';
  const props = {
    route: {
      pageList: [{}, { path }],
      formConfig,
    },
    router: {
      push: () => {},
      replace: () => {},
      go: () => {},
      goBack: () => {},
      goForward: () => {},
      setRouteLeaveHook: () => {},
      isActive: () => {},
      location: { pathname: path },
    },
  };
  const mockStore = (expirationDate = '2025-10-01T00:00:00.000Z') => ({
    getState: () => ({
      form: {
        formId,
        lastSavedDate: Date.now(),
        expirationDate: (Date.now() + 1000 * 60 * 60 * 24) / 1000, // unix time
        itf: {
          currentITF: {
            expirationDate,
          },
        },
        loadedData: { metadata: { returnUrl: path } },
      },
      user: { profile: { prefillsAvailable: [formId] } },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('renders expiration date', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <FormSavedPage {...props} />
      </Provider>,
    );

    expect($('va-alert', container)).to.exist;
    expect($('.expires-container', container)).to.exist;
    expect($('.expires', container).textContent).to.eq('October 1, 2025');
  });

  it('renders problem message', () => {
    const { container } = render(
      <Provider store={mockStore(null)}>
        <FormSavedPage {...props} />
      </Provider>,
    );

    expect($('va-alert', container)).to.exist;
    expect($('.itf-contact-container', container).textContent).to.contain(
      'confirm your intent to file',
    );
  });
});
