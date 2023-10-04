/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import contacts from '@@profile/tests/fixtures/contacts.json';
import PersonalHealthCareContacts from './PersonalHealthCareContacts';

const stateFn = ({
  featureTogglesLoading = false,
  profile_contacts = true,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    profile_contacts,
  },
  contacts: {
    data: contacts.data,
    loading: false,
    error: false,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<PersonalHealthCareContacts />, { initialState });

describe('PersonalHealthCareContacts component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { text: 'Personal health care contacts', level: 2 });
  });

  it('does not render when disabled', () => {
    const initialState = stateFn({ profile_contacts: false });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });

  it('renders a loading indicator when feature toggles are loading', () => {
    const initialState = stateFn({ featureTogglesLoading: true });
    const { getByTestId } = setup({ initialState });
    getByTestId('phcc-loading');
  });
});
