import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import vapProfile from '../../../../user/profile/vap-svc/tests/fixtures/mockVapProfile.json';
import { ADDRESS_TYPES } from '../../../../forms/address/helpers';

import { $, $$ } from '../../../src/js/utilities/ui';
import ContactInfoReview from '../../../src/js/components/ContactInfoReview';
import { getContent } from '../../../src/js/utilities/data/profile';
import clone from '../../../src/js/utilities/data/clone';

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  editPage = () => {},
  requiredKeys = ['homePhone|mobilePhone', 'email', 'mailingAddress'],
} = {}) => ({
  data: {
    veteran: {
      // cloning vapProfile data because within the unit tests we target and
      // change some data values
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? clone(vapProfile.mobilePhone) : null,
      homePhone: home ? clone(vapProfile.homePhone) : null,
      mailingAddress: address ? clone(vapProfile.mailingAddress) : null,
    },
  },
  editPage,

  keys: {
    wrapper: 'veteran',
    homePhone: 'homePhone',
    mobilePhone: 'mobilePhone',
    email: 'email',
    address: 'mailingAddress',
  },
  requiredKeys,
  content: getContent(),
  contactInfoPageKey: 'confirmContactInfo',
});

describe('<ContactInfoReview>', () => {
  const content = getContent();
  it('should render all review page contact data', () => {
    const data = getData();
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('va-button.edit-page', container)).to.exist;
    expect($('h4', container).textContent).to.eq(content.title);
    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(9);
    expect($(`[name="${data.contactInfoPageKey}ScrollElement"]`, container)).to
      .exist;

    const els = $$('dt', container);
    expect(els.length).to.eq(9);
    expect(els.map(el => el.textContent)).to.deep.equal([
      'Home phone number',
      'Mobile phone number',
      'Email address',
      'Country',
      'Street address',
      'Street address line 2',
      'City',
      'State',
      'Zip code',
    ]);
  });
  it('should render all contact data, except home phone on review page', () => {
    const data = getData({ home: false });
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('h4', container).textContent).to.eq(content.title);
    // homePhone, mobilePhone, email, country, street address, address line 2,
    // city, state, zip
    expect($$('dt', container).length).to.eq(9);
    expect(container.innerHTML).to.contain(content.missingPhoneError);
  });
  it('should render international address', () => {
    const data = getData({ address: false });
    data.data.veteran.mailingAddress = {
      addressLine1: 'Great Russell Street',
      addressType: ADDRESS_TYPES.international,
      city: 'London',
      countryName: 'United Kingdom',
      countryCodeIso3: 'GBR',
      internationalPostalCode: 'WC1B 3DG',
    };
    const { container } = render(<ContactInfoReview {...data} />);
    // 3 missing errors: country, street address, city
    const els = $$('dt', container);
    expect(els.length).to.eq(7);
    expect(els.map(el => el.textContent)).to.deep.equal([
      'Home phone number',
      'Mobile phone number',
      'Email address',
      'Country',
      'Street address',
      'City',
      'Postal code',
    ]);
  });

  it('should call editPage callback', () => {
    const editPageSpy = sinon.spy();
    const data = getData({ editPage: editPageSpy });
    const { container } = render(<ContactInfoReview {...data} />);

    fireEvent.click($('va-button.edit-page', container));

    expect(editPageSpy.called).to.be.true;
  });

  // Missing data errors
  it('should show missing phone & email error messages', () => {
    const data = getData({
      home: false,
      mobile: false,
      email: false,
    });
    const { container } = render(<ContactInfoReview {...data} />);
    // 3 missing errors: phone x2, email
    const errorEls = $$('.usa-input-error-message', container);
    expect(errorEls.length).to.eq(3);
    expect(errorEls.map(el => el.textContent)).to.deep.equal([
      'Missing phone number',
      'Missing phone number',
      'Missing email address',
    ]);
  });

  it('should show missing U.S. address error messages', () => {
    const data = getData({ address: false });
    const { container } = render(<ContactInfoReview {...data} />);
    // 5 missing errors: country, street address, city, state & zip
    const errorEls = $$('.usa-input-error-message', container);
    expect(errorEls.length).to.eq(5);
    expect(errorEls.map(el => el.textContent)).to.deep.equal([
      'Missing country',
      'Missing street address',
      'Missing city',
      'Missing state',
      'Missing zip code',
    ]);
  });

  it('should show missing international address error messages', () => {
    const data = getData({ address: false });
    data.data.veteran.mailingAddress = {
      addressType: ADDRESS_TYPES.international,
    };
    const { container } = render(<ContactInfoReview {...data} />);
    // 3 missing errors: country, street address, city
    const errorEls = $$('.usa-input-error-message', container);
    expect(errorEls.length).to.eq(3);
    expect(errorEls.map(el => el.textContent)).to.deep.equal([
      'Missing country',
      'Missing street address',
      'Missing city',
    ]);
  });

  // Invalid data errors
  it('should show invalid phone & zip code error messages', () => {
    const data = getData();
    data.data.veteran.mailingAddress.zipCode = '123';
    data.data.veteran.homePhone.areaCode = '3';
    data.data.veteran.mobilePhone.areaCode = '3';
    const { container } = render(<ContactInfoReview {...data} />);
    // 3 invalid errors: phone x2 & zip
    const errorEls = $$('.usa-input-error-message', container);
    expect(errorEls.length).to.eq(3);
    expect(errorEls.map(el => el.textContent)).to.deep.equal([
      'Invalid phone number',
      'Invalid phone number',
      'Invalid zip code',
    ]);
  });
  it('should show invalid phone error messages & no zip code error for non-U.S. address', () => {
    const data = getData();
    data.data.veteran.mailingAddress.zipCode = '123';
    data.data.veteran.mailingAddress.addressType = ADDRESS_TYPES.international;
    data.data.veteran.homePhone.areaCode = '3';
    data.data.veteran.mobilePhone.areaCode = '3';
    const { container } = render(<ContactInfoReview {...data} />);
    // 3 invalid errors: phone x2 & zip
    const errorEls = $$('.usa-input-error-message', container);
    expect(errorEls.length).to.eq(2);
    expect(errorEls.map(el => el.textContent)).to.deep.equal([
      'Invalid phone number',
      'Invalid phone number',
    ]);
  });
});
