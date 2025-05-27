import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvPageNotFound, {
  mhvPageNotFoundTestId,
} from '../../components/MhvPageNotFound';

const stateFn = ({ loading = false, loa = 3, vaPatient = true } = {}) => ({
  user: {
    profile: {
      loading,
      loa: {
        current: loa,
      },
      vaPatient,
    },
  },
});

const setup = initialState =>
  renderInReduxProvider(<MhvPageNotFound />, {
    initialState: stateFn(initialState),
  });

describe('MhvPageNotFound component', () => {
  it('renders a loading indicator', () => {
    const { getByTestId } = setup({ loading: true });
    getByTestId('mhv-page-not-found--loading');
  });

  it('renders', () => {
    const { getByTestId, getByRole } = setup();
    getByRole('navigation', { name: 'My HealtheVet' });
    getByTestId(mhvPageNotFoundTestId);
  });

  it('excludes the secondary nav with unverified credentials', () => {
    const { getByTestId, findByRole } = setup({ loa: 1 });
    expect(findByRole('navigation', { name: 'My HealtheVet' })).to.be.empty;
    getByTestId(mhvPageNotFoundTestId);
  });

  it('excludes the secondary nav when user is not a patient', () => {
    const { getByTestId, findByRole } = setup({ vaPatient: false });
    expect(findByRole('navigation', { name: 'My HealtheVet' })).to.be.empty;
    getByTestId(mhvPageNotFoundTestId);
  });
});
