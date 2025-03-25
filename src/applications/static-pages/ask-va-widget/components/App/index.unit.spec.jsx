// Node modules.
<<<<<<< HEAD
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import environment from 'platform/utilities/environment';
import { App } from '.';

describe('Ask VA <App>', () => {
  it('renders ask va link when not authenticated', () => {
    const expectedHref = environment.isProduction()
      ? 'https://ask.va.gov'
      : 'https://dvagov-veft-qa.dynamics365portals.us/';
    const wrapper = shallow(<App loa={undefined} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA1', () => {
    const expectedHref = environment.isProduction()
      ? 'https://ask.va.gov/unauthenticated'
      : 'https://dvagov-veft-qa.dynamics365portals.us/unauthenticated';
    const wrapper = shallow(<App loa={1} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA2', () => {
    const expectedHref = environment.isProduction()
      ? 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/'
      : 'https://sqa.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://iam-ssoe-sqa1-veis.devtest.vaec.va.gov/ava/SSO/Metadata/';
    const wrapper = shallow(<App loa={2} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA2+', () => {
    const expectedHref = environment.isProduction()
      ? 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/'
      : 'https://sqa.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://iam-ssoe-sqa1-veis.devtest.vaec.va.gov/ava/SSO/Metadata/';
    const wrapper = shallow(<App loa={3} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
=======
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
// Relative imports.
import { App } from '.';

describe('Ask VA <App>', () => {
  it('renders ask va link with correct href and text', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('a[href="/contact-us/ask-va"]')).to.have.lengthOf(1);
    expect(wrapper.find('a[href="/contact-us/ask-va"]').text()).to.equal(
      'Contact us online through Ask VA',
    );
    expect(wrapper.find('a[rel="noreferrer noopener"]')).to.have.lengthOf(1);
>>>>>>> main
    wrapper.unmount();
  });
});
