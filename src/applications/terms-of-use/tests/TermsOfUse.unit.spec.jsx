import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import TermsOfUse, { parseRedirectUrl } from '../containers/TermsOfUse';

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
  it('should display content regardless of loggedIn state', () => {
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

describe('parseRedirectUrl', () => {
  const testUrls = {
    [`https%3A%2F%2Fdev.va.gov%2Fauth%2Flogin%2Fcallback%2F%3Ftype%3Didme`]: `https://dev.va.gov/auth/login/callback/?type=idme`,
    [`https://staging-patientportal.myhealth.va.gov`]: `https://staging-patientportal.myhealth.va.gov`,
    [`https://staging-patientportal.myhealth.va.gov/?authenticated=true`]: `https://staging-patientportal.myhealth.va.gov/?authenticated=true`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`,
    [`https://google.com?q=https://va.gov`]: `https://dev.va.gov`,
  };
  Object.entries(testUrls).forEach(([parsedUrl, formattedUrl]) => {
    it('should return the proper url', () => {
      expect(parseRedirectUrl(parsedUrl)).to.eql(formattedUrl);
    });
  });
});
