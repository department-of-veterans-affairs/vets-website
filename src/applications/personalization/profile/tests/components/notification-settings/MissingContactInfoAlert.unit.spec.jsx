import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import MissingContactInfoAlert from '../../../components/notification-settings/MissingContactInfoAlert';

const initialState = { user: { profile: { loa: { current: 3 } } } };

describe('MissingContactInfoAlert', () => {
  it('does not render when Mobile and Email are present', () => {
    const view = renderWithStoreAndRouter(
      <MissingContactInfoAlert
        missingEmailAddress={false}
        missingMobilePhone={false}
      />,
      { initialState },
    );

    expect(view.queryByTestId('missing-contact-info-alert')).to.not.exist;
  });

  it('renders when Mobile is missing', () => {
    const view = renderWithStoreAndRouter(
      <MissingContactInfoAlert
        missingEmailAddress={false}
        missingMobilePhone
      />,
      { initialState },
    );

    expect(view.queryByTestId('missing-contact-info-alert')).to.exist;
    expect(view.getByText(/We don’t have your mobile phone number/i)).to.exist;
  });

  it('renders when Mobile and Email are missing, and showEmailNotificationSettings is true', () => {
    const view = renderWithStoreAndRouter(
      <MissingContactInfoAlert
        missingEmailAddress
        missingMobilePhone
        showEmailNotificationSettings
      />,
      { initialState },
    );

    expect(view.queryByTestId('missing-contact-info-alert')).to.exist;
    expect(view.getByText(/We don’t have your contact information/i)).to.exist;
  });
});
