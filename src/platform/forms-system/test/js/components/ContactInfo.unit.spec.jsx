import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor, fireEvent } from '@testing-library/react';

import vapProfile from '../../../../user/profile/vap-svc/tests/fixtures/mockVapProfile.json';

import { $, $$ } from '../../../src/js/utilities/ui';
import ContactInfo from '../../../src/js/components/ContactInfo';
import {
  getContent,
  setReturnState,
  clearReturnState,
  getReturnState,
} from '../../../src/js/utilities/data/profile';

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  onReviewPage = false,
  forwardSpy = () => {},
  updateSpy = () => {},
  requiredKeys = ['homePhone|mobilePhone', 'email', 'mailingAddress'],
  uiSchema = {},
} = {}) => ({
  data: {
    veteran: {
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? vapProfile.mobilePhone : null,
      homePhone: home ? vapProfile.homePhone : null,
      mailingAddress: address ? vapProfile.mailingAddress : null,
    },
  },
  setFormData: () => {},
  goBack: () => {},
  goForward: forwardSpy,
  onReviewPage,
  updatePage: updateSpy,
  contentAfterButtons: <div>after</div>,
  contentBeforeButtons: <div>before</div>,

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
  uiSchema,
});

const mockStore = {
  getState: () => ({
    vapService: {},
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        vapContactInfo: vapProfile,
      },
      form: {
        veteran: {},
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('<ContactInfo>', () => {
  afterEach(() => {
    clearReturnState();
  });
  it('should render contact data w/no error messages', () => {
    const data = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInfo {...data} />
      </Provider>,
    );

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert[status="error"]', container).length).to.equal(0);
    expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    expect(
      $$('va-alert[status="success"][visible="true"]', container).length,
    ).to.equal(0);
    expect($$('h3', container).length).to.equal(1);
    expect($$('h4', container).length).to.equal(4);
    expect($$('h5', container).length).to.equal(0);
    // mobile phone, home phone, email, mailing address x2
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.equal(5);
    expect($(`[name="${data.contactInfoPageKey}ScrollElement"]`, container)).to
      .exist;
  });

  it('should render contact data w/no success messages', () => {
    const props = getData();
    // data exists (no error) & shouldn't show success message after updating
    const data = {
      veteran: {
        email: 'x@x.com',
        mobilePhone: { ...vapProfile.mobilePhone, updatedAt: '' },
        homePhone: { ...vapProfile.homePhone, updatedAt: '' },
        mailingAddress: { ...vapProfile.mailingAddress, updatedAt: '' },
      },
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInfo {...props} data={data} />
      </Provider>,
    );

    expect($$('va-alert[status="error"]', container).length).to.equal(0);
    expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    expect(
      $$('va-alert[status="success"][visible="true"]', container).length,
    ).to.equal(0);
  });

  describe.skip('Successful edit', () => {
    it('should render a success alert and focus it after editing home phone', async () => {
      const data = getData();
      setReturnState('home-phone', 'updated');
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

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
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

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
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

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
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const alert = $('#updated-address', container);
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('Mailing address updated');
      await waitFor(() => {
        expect(document.activeElement).to.eq(alert);
      });
    });

    it('should render a success alert stating that missing info was added & user may continue', async () => {
      const data = getData({ email: false });
      const { container, rerender } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      expect($('va-alert[status="warning"]', container)).to.exist;
      setReturnState('email', 'updated');
      rerender(
        <Provider store={mockStore}>
          <ContactInfo {...getData()} testContinueAlert />
        </Provider>,
      );

      await waitFor(() => {
        const alert = $('va-alert[status="success"]', container);
        expect(alert.innerHTML).to.contain('You may continue');
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
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const edit = $('#edit-home-phone', container);
      await expect(edit).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling mobile phone', async () => {
      const data = getData();
      setReturnState('mobile-phone', 'canceled');
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const edit = $('#edit-mobile-phone', container);
      expect(edit).to.exist;

      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling email', async () => {
      const data = getData();
      setReturnState('email', 'canceled');
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const edit = $('#edit-email', container);
      expect(edit).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.eq(edit);
      });
    });
    it('edit focus after canceling mailing address', async () => {
      const data = getData();
      setReturnState('address', 'canceled');
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

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
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      expect($$('va-alert[status="error"]', container).length).to.equal(0);
      expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    });
    it('should not render an alert when only mobile phone number is missing', () => {
      const data = getData({ mobile: false });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      expect($$('va-alert[status="error"]', container).length).to.equal(0);
      expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    });
    it('should render an alert with missing phone data', () => {
      const data = getData({ home: false, mobile: false });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain(
        'Your home or mobile phone is missing',
      );
    });
    it('should render an alert with missing address data', () => {
      const data = getData({ address: false });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain('Your mailing address is missing');
    });
    it('should render an alert with missing email', () => {
      const data = getData({ email: false });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain('Your email address is missing');
    });
    it('should render an alert when missing all data', () => {
      const data = getData({
        email: false,
        home: false,
        mobile: false,
        address: false,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      const alert = $$('va-alert[status="warning"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain(
        'Your home or mobile phone, email address, and mailing address are missing',
      );
    });
    it('should render an error alert with missing email on submission', () => {
      const data = getData({ email: false });
      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );
      // continue button click
      fireEvent.click($('.usa-button-primary', container));

      const alert = $$('va-alert[status="error"]', container);
      expect(alert.length).to.equal(1);
      expect(alert[0].innerHTML).to.contain(
        'have your email address. Please edit',
      );
    });
  });

  describe('call ui:required & ui:validations & show validation errors', () => {
    const getUiSchema = ({ req = () => true, validations = [] }) => ({
      'ui:required': req,
      'ui:validations': validations,
    });

    it('should check ui:required', () => {
      const requiredSpy = sinon.spy();
      const uiSchema = getUiSchema({ req: requiredSpy });
      const data = getData({ uiSchema });
      render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      expect(requiredSpy.called).to.be.true;
    });
    it('should check ui:validations', () => {
      const validationSpy = sinon.spy();
      const uiSchema = getUiSchema({ validations: [validationSpy] });
      const data = getData({ uiSchema });
      render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      expect(validationSpy.called).to.be.true;
    });
    it('should render validation errors', async () => {
      const uiSchema = getUiSchema({
        validations: [err => err.addError('some error')],
      });
      const data = getData({ uiSchema });

      const { container } = render(
        <Provider store={mockStore}>
          <ContactInfo {...data} />
        </Provider>,
      );

      // continue button click
      fireEvent.click($('.usa-button-primary', container));

      const alert = $('va-alert[status="error"]', container);
      await waitFor(() => {
        expect(alert).to.exist;
        expect(alert.innerHTML).to.contain('some error');
      });
    });
  });

  it('should render contact data in review page edit mode', () => {
    const data = getData({ onReviewPage: true });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInfo {...data} />
      </Provider>,
    );

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert[status="error"]', container).length).to.equal(0);
    expect($$('va-alert[status="warning"]', container).length).to.equal(0);
    expect($$('h3', container).length).to.equal(0);
    expect($$('h4', container).length).to.equal(1);
    expect($$('h5', container).length).to.equal(4);
  });

  it('should call go forward callback', async () => {
    setReturnState('testing123');
    const forwardSpy = sinon.spy();
    const data = getData({ forwardSpy });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInfo {...data} />
      </Provider>,
    );

    fireEvent.click($('.usa-button-primary', container));
    expect(forwardSpy.called).to.be.true;
    // return state gets cleared on continuing past the page
    await expect(getReturnState()).to.equal('');
  });
  it('should call updatePage callback', async () => {
    const updateSpy = sinon.spy();
    const data = getData({ updateSpy, onReviewPage: true });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInfo {...data} />
      </Provider>,
    );

    fireEvent.click($('va-button', container));
    expect(updateSpy.called).to.be.true;
    // return state is set to 'true,' on update so the form returns back to the
    // review & submit page
    await expect(getReturnState()).to.contain('true');
  });
});
