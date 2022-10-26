import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import ContactInformation from '../../components/ContactInformation';
import vapProfile from '../fixtures/mocks/vapProfile.json';

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
} = {}) => ({
  props: {
    loggedIn: true,
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          vapContactInfo: {
            email: email ? vapProfile.email : null,
            mobilePhone: mobile ? vapProfile.mobilePhone : null,
            homePhone: home ? vapProfile.homePhone : null,
            mailingAddress: address ? vapProfile.mailingAddress : null,
          },
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('<ContactInformation>', () => {
  it('should render contact data w/no error messages', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    expect($('.blue-bar-block', container)).to.exist;
    expect($$('va-alert', container).length).to.equal(0);
  });
  it('should not render an alert when only home phone number is missing', () => {
    const { props, mockStore } = getData({ home: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    expect($$('va-alert', container).length).to.equal(0);
  });
  it('should not render an alert when only mobile phone number is missing', () => {
    const { props, mockStore } = getData({ mobile: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    expect($$('va-alert', container).length).to.equal(0);
  });
  it('should render an alert with missing phone data', () => {
    const { props, mockStore } = getData({ home: false, mobile: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain(
      'Your home or mobile phone is missing',
    );
  });
  it('should render an alert with missing address data', () => {
    const { props, mockStore } = getData({ address: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain('Your address is missing');
  });
  it('should render an alert with missing email', () => {
    const { props, mockStore } = getData({ email: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain('Your email is missing');
  });
  it('should render an alert when missing all data', () => {
    const { props, mockStore } = getData({
      email: false,
      home: false,
      mobile: false,
      address: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <ContactInformation {...props} />
      </Provider>,
    );

    const alert = $$('va-alert', container);
    expect(alert.length).to.equal(1);
    expect(alert[0].innerHTML).to.contain(
      'Your home or mobile phone, email, and address are missing',
    );
  });
});
