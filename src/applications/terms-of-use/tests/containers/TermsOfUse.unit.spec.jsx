import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import TermsOfUse from '../../containers/TermsOfUse';

const store = ({ termsOfUseEnabled = true } = {}) => ({
  getState: () => ({
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
    expect($('va-accordion', container)).to.exist;
    expect($('va-alert', container)).to.exist;
  });
  it('should display content if not signed in', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect($$('va-button', container).length).to.eql(2);
  });
  it('should NOT display Accept or Decline buttons termsOfUse Flipper is disabled', () => {
    const mockStore = store({ termsOfUseEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(0);
  });
});
