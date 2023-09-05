import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import TermsOfUse from '../../containers/TermsOfUse';

const store = ({ isLoggedIn = false, termsOfUseEnabled = true } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      terms_of_use: termsOfUseEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('TermsOfUse', () => {
  it('should render', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eql(
      'VA online services terms of use',
    );
    expect($('va-on-this-page', container)).to.exist;
    expect($('va-link', container)).to.exist;
    expect($('va-accordion', container)).to.exist;
    expect($('va-alert', container)).to.exist;
  });
  it('should display content if not signed in', () => {
    const mockStore = store();
    const wrapper = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect(wrapper.queryByText(/Once you’re signed in/)).to.exist;
  });
  it('should display Accept or Decline buttons when signed in', () => {
    const mockStore = store({ isLoggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(2);
  });
  it('should NOT display Accept or Decline buttons when signed in and termsOfUse Flipper is disabled', () => {
    const mockStore = store({ isLoggedIn: true, termsOfUseEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(0);
  });
  it('should NOT display Accept or Decline buttons when signed in and termsOfUse Flipper is disabled', () => {
    const mockStore = store({ isLoggedIn: true, termsOfUseEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(0);
  });
});
