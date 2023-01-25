import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ContactInfo from '../../components/ContactInfo';
import vapProfile from '../fixtures/mocks/vapProfile.json';

// TO DO - update this unit test!

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  onReviewPage = false,
  forwardSpy = () => {},
  updateSpy = () => {},
} = {}) => ({
  data: {
    veteran: {
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? vapProfile.mobilePhone : null,
      homePhone: home ? vapProfile.homePhone : null,
      address: address ? vapProfile.mailingAddress : null,
    },
  },
  goBack: () => {},
  goForward: forwardSpy,
  onReviewPage,
  updatePage: updateSpy,
  contentAfterButtons: <div>after</div>,
  contentBeforeButtons: <div>before</div>,
});

describe('<ContactInfo>', () => {
  it('should render contact data w/no error messages', () => {
    const data = getData();
    const { container } = render(<ContactInfo {...data} />);

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert', container).length).to.equal(0);
    expect($$('h3', container).length).to.equal(1);
    expect($$('h4', container).length).to.equal(4);
    expect($$('h5', container).length).to.equal(0);
  });
  it('should not render an alert when only home phone number is missing', () => {
    const data = getData({ home: false });
    const { container } = render(<ContactInfo {...data} />);

    expect($$('va-alert', container).length).to.equal(0);
  });
  it('should not render an alert when only mobile phone number is missing', () => {
    const data = getData({ mobile: false });
    const { container } = render(<ContactInfo {...data} />);

    expect($$('va-alert', container).length).to.equal(0);
  });
  it('should render an alert with missing phone data', () => {
    const data = getData({ home: false, mobile: false });
    const { container } = render(<ContactInfo {...data} />);

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain(
      'Your home or mobile phone is missing',
    );
  });
  it('should render an alert with missing address data', () => {
    const data = getData({ address: false });
    const { container } = render(<ContactInfo {...data} />);

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain('Your address is missing');
  });
  it('should render an alert with missing email', () => {
    const data = getData({ email: false });
    const { container } = render(<ContactInfo {...data} />);

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain('Your email is missing');
  });
  it('should render an alert when missing all data', () => {
    const data = getData({
      email: false,
      home: false,
      mobile: false,
      address: false,
    });
    const { container } = render(<ContactInfo {...data} />);

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain(
      'Your home or mobile phone, email, and address are missing',
    );
  });

  it('should render contact data in review page edit mode', () => {
    const data = getData({ onReviewPage: true });
    const { container } = render(<ContactInfo {...data} />);

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert', container).length).to.equal(0);
    expect($$('h3', container).length).to.equal(0);
    expect($$('h4', container).length).to.equal(1);
    expect($$('h5', container).length).to.equal(4);
  });
});
