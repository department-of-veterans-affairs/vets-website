import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from '../../../src/js/utilities/ui';
import ContactInfoReview from '../../../src/js/components/ContactInfoReview';
import { getContent } from '../../../src/js/utilities/data/profile';

const vapProfile = {
  email: {
    emailAddress: 'no@no.com',
  },
  mailingAddress: {
    addressLine1: '123 Main',
    addressLine2: 'Apt 2',
    addressLine3: null,
    addressType: 'DOMESTIC',
    city: 'City',
    countryName: 'United States',
    internationalPostalCode: null,
    province: null,
    stateCode: 'AK',
    zipCode: '90210',
  },
  mobilePhone: {
    areaCode: '717',
    countryCode: '1',
    phoneNumber: '4241234',
  },
  homePhone: {
    areaCode: '703',
    countryCode: '1',
    phoneNumber: '3218526',
  },
};

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
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? vapProfile.mobilePhone : null,
      homePhone: home ? vapProfile.homePhone : null,
      mailingAddress: address ? vapProfile.mailingAddress : null,
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
});

describe('<ContactInfoReview>', () => {
  const content = getContent();
  it('should render all review page contact data', () => {
    const data = getData();
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('button.edit-page', container)).to.exist;
    expect($('h4', container).textContent).to.eq(content.title);
    expect($$('dt', container).length).to.eq(9);
    expect(container.innerHTML).to.contain('Home phone');
  });
  it('should render all contact data, except home phone on review page', () => {
    const data = getData({ home: false });
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('h4', container).textContent).to.eq(content.title);
    expect($$('dt', container).length).to.eq(8);
    expect(container.innerHTML).to.not.contain('Home phone');
  });

  it('should call editPage callback', () => {
    const editPageSpy = sinon.spy();
    const data = getData({ editPage: editPageSpy });
    const { container } = render(<ContactInfoReview {...data} />);

    fireEvent.click($('button.edit-page', container));

    expect(editPageSpy.called).to.be.true;
  });
});
