/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import emergencyContacts from '@@profile/tests/fixtures/ec.json';
import nextOfKin from '@@profile/tests/fixtures/nok.json';
import PersonalHealthCareContacts from './index';

const stateFn = ({
  featureTogglesLoading = false,
  nok_ec_read_only = true,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    nok_ec_read_only,
  },
  emergencyContacts: {
    data: emergencyContacts.data,
    loading: false,
    error: false,
  },
  nextOfKin: {
    data: nextOfKin.data,
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
    const initialState = stateFn({ nok_ec_read_only: false });
    const { container } = setup({ initialState });
    expect(container).to.be.empty;
  });

  it('renders a loading indicator when feature toggles are loading', () => {
    const initialState = stateFn({ featureTogglesLoading: true });
    const { getByTestId } = setup({ initialState });
    getByTestId('phcc-loading');
  });
});
