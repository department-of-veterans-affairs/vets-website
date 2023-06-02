import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import ContactInfoOnFile from '../../../components/notification-settings/ContactInfoOnFile';

const initialState = { user: { profile: { loa: { current: 3 } } } };
const email = 'test@test.com';
const phone = '1234567890';

describe('ContactInfoOnFile', () => {
  it('does renders Email and Mobile phone info', () => {
    const view = renderWithStoreAndRouter(
      <ContactInfoOnFile emailAddress={email} mobilePhoneNumber={phone} />,
      { initialState },
    );

    expect(view.findByText(phone)).to.exist;
    expect(view.findByText(email)).to.exist;
  });

  it('does not renders info when it is not available', () => {
    const view = renderWithStoreAndRouter(<ContactInfoOnFile />, {
      initialState,
    });

    expect(view.queryByText(/update/i)).to.not.exist;
    expect(view.queryByText(/update email/i)).to.not.exist;
  });
});
