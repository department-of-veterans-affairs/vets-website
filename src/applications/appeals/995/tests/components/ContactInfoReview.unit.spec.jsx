import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ContactInfoReview from '../../components/ContactInfoReview';
import vapProfile from '../fixtures/mocks/vapProfile.json';
import { content } from '../../content/contactInfo';

// TO DO - update this unit test!

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  editSpy = () => {},
} = {}) => ({
  data: {
    veteran: {
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? vapProfile.mobilePhone : null,
      homePhone: home ? vapProfile.homePhone : null,
      address: address ? vapProfile.mailingAddress : null,
    },
  },
  editPage: editSpy,
});

describe('<ContactInfoReview>', () => {
  it('should render all review page contact data', () => {
    const data = getData();
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('h4', container).textContent).to.eq(content.title);
    expect($$('dt', container).length).to.eq(8);
    expect(container.innerHTML).to.contain('Home phone');
  });
  it('should render all contact data, except home phone on review page', () => {
    const data = getData({ home: false });
    const { container } = render(<ContactInfoReview {...data} />);

    expect($('h4', container).textContent).to.eq(content.title);
    expect($$('dt', container).length).to.eq(7);
    expect(container.innerHTML).to.not.contain('Home phone');
  });
});
