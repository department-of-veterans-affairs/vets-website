import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { $, $$ } from '../../../src/js/utilities/ui';
import ContactInfo from '../../../src/js/components/ContactInfo';
import {
  getContent,
  setReturnState,
  clearReturnState,
} from '../../../src/js/utilities/data/profile';

const vapProfile = {
  email: {
    createdAt: '2022-09-14T13:43:23.000+00:00',
    emailAddress: 'no@no.com',
    effectiveEndDate: null,
    effectiveStartDate: '2022-09-14T13:43:22.000+00:00',
    id: 227325,
    sourceDate: '2022-09-14T13:43:22.000+00:00',
    sourceSystemUser: null,
    transactionId: '8cf2ea49-647c-47a8-a46d-47a470d04193',
    updatedAt: '2022-09-14T13:43:23.000+00:00',
    vet360Id: '121435',
  },
  mailingAddress: {
    addressLine1: '123 Main',
    addressLine2: 'Apt 2',
    addressLine3: null,
    addressPou: 'CORRESPONDENCE',
    addressType: 'DOMESTIC',
    city: 'City',
    countryName: 'United States',
    countryCodeIso2: 'US',
    countryCodeIso3: 'USA',
    countryCodeFips: null,
    countyCode: null,
    countyName: null,
    createdAt: '2022-07-15T13:49:44.000+00:00',
    effectiveEndDate: null,
    effectiveStartDate: '2022-08-05T18:42:20.000+00:00',
    geocodeDate: '2022-08-05T18:42:21.000+00:00',
    geocodePrecision: null,
    id: 334540,
    internationalPostalCode: null,
    latitude: 34.0916,
    longitude: -118.4097,
    province: null,
    sourceDate: '2022-08-05T18:42:20.000+00:00',
    sourceSystemUser: null,
    stateCode: 'AK',
    transactionId: 'd45cf2cc-d803-4d52-9ae1-598af40ace7b',
    updatedAt: '2022-08-05T18:42:21.000+00:00',
    validationKey: null,
    vet360Id: '121435',
    zipCode: '90210',
    zipCodeSuffix: null,
    badAddress: false,
  },
  mobilePhone: {
    areaCode: '717',
    countryCode: '1',
    createdAt: '2022-09-14T13:43:00.000+00:00',
    extension: null,
    effectiveEndDate: null,
    effectiveStartDate: '2022-09-14T13:42:59.000+00:00',
    id: 313007,
    isInternational: false,
    isTextable: null,
    isTextPermitted: null,
    isTty: null,
    isVoicemailable: null,
    phoneNumber: '4241234',
    phoneType: 'MOBILE',
    sourceDate: '2022-09-14T13:42:59.000+00:00',
    sourceSystemUser: null,
    transactionId: '1dce17de-2a16-480f-b97b-8b9f45180753',
    updatedAt: '2022-09-14T13:43:00.000+00:00',
    vet360Id: '121435',
  },
  homePhone: {
    areaCode: '703',
    countryCode: '1',
    createdAt: '2022-09-02T16:50:12.000+00:00',
    extension: null,
    effectiveEndDate: null,
    effectiveStartDate: '2022-07-14T17:44:00.000+00:00',
    id: 310702,
    isInternational: false,
    isTextable: null,
    isTextPermitted: null,
    isTty: null,
    isVoicemailable: null,
    phoneNumber: '3218526',
    phoneType: 'HOME',
    sourceDate: '2022-07-14T17:44:00.000+00:00',
    sourceSystemUser: null,
    transactionId: '7518d578-2688-4f7e-bd28-a270538b0cfd',
    updatedAt: '2022-09-02T16:50:12.000+00:00',
    vet360Id: '121435',
  },
  residentialAddress: null,
  workPhone: null,
  temporaryPhone: null,
  faxNumber: null,
  textPermission: null,
};

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  onReviewPage = false,
  forwardSpy = () => {},
  updateSpy = () => {},
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
    expect($$('h3', container).length).to.equal(1);
    expect($$('h4', container).length).to.equal(4);
    expect($$('h5', container).length).to.equal(0);
  });

  describe('Successful edit', () => {
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
});
