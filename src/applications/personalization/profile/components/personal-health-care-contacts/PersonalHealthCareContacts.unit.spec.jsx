/* eslint-disable camelcase */
import React from 'react';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import contacts from '@@profile/tests/fixtures/contacts.json';
import reducers from '@@profile/reducers';
import { fireEvent } from '@testing-library/react';
import PersonalHealthCareContacts from './PersonalHealthCareContacts';

const stateFn = ({ loading = false, error = false } = {}) => ({
  profileContacts: {
    data: contacts.data,
    loading,
    error,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<PersonalHealthCareContacts />, {
    initialState,
    reducers,
  });

describe('PersonalHealthCareContacts component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { text: 'Personal health care contacts', level: 1 });
  });

  it('displays help desk contact information', () => {
    const { getByTestId } = setup();
    const infoComponent = getByTestId('phcc-how-to-update');
    fireEvent.click(infoComponent);
    getByTestId('va-800-number');
    getByTestId('va-711-number');
  });

  it('renders a loading indicator when contacts are loading', () => {
    const initialState = stateFn({ loading: true });
    const { getByTestId } = setup({ initialState });
    getByTestId('phcc-loading');
  });

  it('renders an alert when loading fails', () => {
    const initialState = stateFn({ error: 'err' });
    const { getByTestId } = setup({ initialState });
    getByTestId('service-is-down-banner');
  });
});
