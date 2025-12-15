import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import ContactInfoOnFile from '../../../components/notification-settings/ContactInfoOnFile';

const initialState = { user: { profile: { loa: { current: 3 } } } };

describe('ContactInfoOnFile', () => {
  it('renders Email and Mobile phone info', async () => {
    const email = 'test@test.com';
    const phone = { areaCode: '123', phoneNumber: '4567890' };

    const view = renderWithStoreAndRouter(
      <ContactInfoOnFile
        emailAddress={email}
        mobilePhoneNumber={phone}
        showEmailNotificationSettings
      />,
      { initialState },
    );

    expect(await view.findByTestId('mobile-phone-number-on-file')).to.exist;
    expect(await view.findByTestId('email-address-on-file')).to.exist;
  });

  it('does not render info when it is not available', () => {
    const view = renderWithStoreAndRouter(<ContactInfoOnFile />, {
      initialState,
    });

    expect(view.queryByText(/update/i)).to.not.exist;
    expect(view.queryByText(/update email/i)).to.not.exist;
  });
});
