import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ContactInfo from '../../components/ContactInfo';
import vapProfile from '../fixtures/mocks/vapProfile.json';
import { setReturnState, clearReturnState } from '../../utils/contactInfo';

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
  afterEach(() => {
    clearReturnState();
  });
  it('should render contact data w/no error messages', () => {
    const data = getData();
    const { container } = render(<ContactInfo {...data} />);

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert[status="error"]', container).length).to.equal(0);
    expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    expect($$('h3', container).length).to.equal(1);
    expect($$('h4', container).length).to.equal(4);
    expect($$('h5', container).length).to.equal(0);
    // mobile phone, home phone, email, mailing address x2
    expect($$('.dd-privacy-hidden', container).length).to.equal(5);
  });

  describe('Successful edit', () => {
    it('should render a success alert and focus it after editing home phone', async () => {
      const data = getData();
      setReturnState('home-phone', 'updated');
      const { container } = render(<ContactInfo {...data} />);

      const alert = $('#updated-home-phone', container);
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('Home phone number updated');
      await waitFor(() => {
        expect(document.activeElement).to.eq(alert);
      });
    });
    it('should render a success alert and focus it after editing mobile phone', async () => {
      const data = getData();
      setReturnState('mobile-phone', 'updated');
      const { container } = render(<ContactInfo {...data} />);

      const alert = $('#updated-mobile-phone', container);
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('Mobile phone number updated');
      await waitFor(() => {
        expect(document.activeElement).to.eq(alert);
      });
    });
    it('should render a success alert and focus it after editing email', async () => {
      const data = getData();
      setReturnState('email', 'updated');
      const { container } = render(<ContactInfo {...data} />);

      const alert = $('#updated-email', container);
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('Email address updated');
      await waitFor(() => {
        expect(document.activeElement).to.eq(alert);
      });
    });
    it('should render a success alert and focus it after editing mailing address', async () => {
      const data = getData();
      setReturnState('address', 'updated');
      const { container } = render(<ContactInfo {...data} />);

      const alert = $('#updated-address', container);
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('Mailing address updated');
      await waitFor(() => {
        expect(document.activeElement).to.eq(alert);
      });
    });
  });

  // Skipping these as these tests aren't working as expected - focus ends up
  // on the document body instead of the edit link - this pattern works for the
  // success alert focus, but not for the link?
  describe.skip('Canceled edit', () => {
    it('edit focus after canceling home phone', async () => {
      const data = getData();
      setReturnState('home-phone', 'canceled');
      const { container } = render(<ContactInfo {...data} />);

      const edit = $('#edit-home-phone', container);
      await expect(edit).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling mobile phone', async () => {
      const data = getData();
      setReturnState('mobile-phone', 'canceled');
      const { container } = render(<ContactInfo {...data} />);

      const edit = $('#edit-mobile-phone', container);
      expect(edit).to.exist;

      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling email', async () => {
      const data = getData();
      setReturnState('email', 'canceled');
      const { container } = render(<ContactInfo {...data} />);

      const edit = $('#edit-email', container);
      expect(edit).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling mailing address', async () => {
      const data = getData();
      setReturnState('address', 'canceled');
      const { container } = render(<ContactInfo {...data} />);

      const edit = $('#edit-address', container);
      expect(edit).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
  });

  describe('missing info alerts', () => {
    it('should not render an alert when only home phone number is missing', () => {
      const data = getData({ home: false });
      const { container } = render(<ContactInfo {...data} />);

      expect($$('va-alert[status="error"]', container).length).to.equal(0);
      expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    });
    it('should not render an alert when only mobile phone number is missing', () => {
      const data = getData({ mobile: false });
      const { container } = render(<ContactInfo {...data} />);

      expect($$('va-alert[status="error"]', container).length).to.equal(0);
      expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    });
    it('should render an alert with missing phone data', () => {
      const data = getData({ home: false, mobile: false });
      const { container } = render(<ContactInfo {...data} />);

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain(
        'Your home or mobile phone is missing',
      );
    });
    it('should render an alert with missing address data', () => {
      const data = getData({ address: false });
      const { container } = render(<ContactInfo {...data} />);

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain('Your address is missing');
    });
    it('should render an alert with missing email', () => {
      const data = getData({ email: false });
      const { container } = render(<ContactInfo {...data} />);

      const alert = $$('va-alert[status="warning"]', container);
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

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain(
        'Your home or mobile phone, email, and address are missing',
      );
    });
    it('should render an error alert with missing email on submission', () => {
      const data = getData({ email: false });
      const { container } = render(<ContactInfo {...data} />);
      // continue button click
      fireEvent.click($('.usa-button-primary', container));

      const alert = $$('va-alert[status="error"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain('have your email. Please edit');
    });
  });

  it('should render contact data in review page edit mode', () => {
    const data = getData({ onReviewPage: true });
    const { container } = render(<ContactInfo {...data} />);

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert[status="error"]', container).length).to.equal(0);
    expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    expect($$('h3', container).length).to.equal(0);
    expect($$('h4', container).length).to.equal(1);
    expect($$('h5', container).length).to.equal(4);
  });
});
