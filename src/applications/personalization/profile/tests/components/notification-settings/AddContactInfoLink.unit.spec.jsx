import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { MISSING_CONTACT_INFO } from '@@vap-svc/constants';

import AddContactInfoLink from '../../../components/notification-settings/AddContactInfoLink';

const initialState = { user: { profile: { loa: { current: 3 } } } };

describe('AddContactInfoLink', () => {
  it('renders link for Email', () => {
    const view = renderWithStoreAndRouter(
      <AddContactInfoLink missingInfo={MISSING_CONTACT_INFO.EMAIL} />,
      { initialState },
    );

    expect(view.findByText('Add your email address')).to.exist;
  });

  it('renders link for Mobile Phone', () => {
    const view = renderWithStoreAndRouter(
      <AddContactInfoLink missingInfo={MISSING_CONTACT_INFO.MOBILE} />,
      { initialState },
    );

    expect(view.findByText('Add your mobile phone number')).to.exist;
  });
});
