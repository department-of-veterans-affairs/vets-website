/* eslint-disable camelcase */
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import contacts from '@@profile/tests/fixtures/contacts.json';
import reducers from '@@profile/reducers';
import PersonalHealthCareContacts from './PersonalHealthCareContacts';

const stateFn = ({
  loading = false,
  error = false,
  data = contacts.data,
} = {}) => ({
  profileContacts: {
    data,
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
  beforeEach(() => {
    mockFetch();
  });

  it('renders', async () => {
    const { getByRole } = setup();
    await waitFor(() => {
      getByRole('heading', { text: 'Personal health care contacts', level: 1 });
    });
  });

  it('displays help desk contact information', async () => {
    const { getByTestId } = setup();
    await waitFor(() => {
      const infoComponent = getByTestId('phcc-how-to-update');
      fireEvent.click(infoComponent);
      getByTestId('help-desk-va-800-number');
      getByTestId('help-desk-va-711-number');
    });
  });

  it('renders a loading indicator when contacts are loading', async () => {
    const initialState = stateFn({ loading: true });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('phcc-loading');
    });
  });

  it('renders an alert when loading fails', async () => {
    const initialState = stateFn({ error: 'err' });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('service-is-down-banner');
    });
  });

  it('handles an empty array of contacts', async () => {
    const initialState = stateFn({ data: [] });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('phcc-no-ecs');
      getByTestId('phcc-no-nok');
    });
  });
});
