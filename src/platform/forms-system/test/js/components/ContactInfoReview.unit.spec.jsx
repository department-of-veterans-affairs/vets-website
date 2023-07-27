import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import vapProfile from '../../../../user/profile/vap-svc/tests/fixtures/mockVapProfile.json';

import { $, $$ } from '../../../src/js/utilities/ui';
import ContactInfoReview from '../../../src/js/components/ContactInfoReview';
import { getContent } from '../../../src/js/utilities/data/profile';

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
    expect($$('dd', container).length).to.eq(9);
    expect($$('dd.dd-privacy-hidden', container).length).to.eq(9);
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
