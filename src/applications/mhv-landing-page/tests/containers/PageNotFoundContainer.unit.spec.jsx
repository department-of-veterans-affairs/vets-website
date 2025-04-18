import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { pageNotFoundTestId } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import PageNotFoundContainer from '../../containers/PageNotFoundContainer';
import reducers from '../../reducers';

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
  renderInReduxProvider(<PageNotFoundContainer />, {
    initialState: stateFn(initialState),
    reducers,
  });

describe('PageNotFound component', () => {
  it('renders a loading indicator', () => {
    const { getByTestId } = setup({ loading: true });
    getByTestId('mhv-page-not-found--loading');
  });

  it('renders', () => {
    const { getByTestId, getByRole } = setup();
    getByRole('navigation', { name: 'My HealtheVet' });
    getByTestId(pageNotFoundTestId);
  });

  it('excludes the secondary nav with unverified credentials', () => {
    const { getByTestId, findByRole } = setup({ loa: 1 });
    expect(findByRole('navigation', { name: 'My HealtheVet' })).to.be.empty;
    getByTestId(pageNotFoundTestId);
  });

  it('excludes the secondary nav when user is not a patient', () => {
    const { getByTestId, findByRole } = setup({ vaPatient: false });
    expect(findByRole('navigation', { name: 'My HealtheVet' })).to.be.empty;
    getByTestId(pageNotFoundTestId);
  });
});
