import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const stateFn = ({ loading } = {}) => ({
  featureToggles: {
    loading,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<MhvSecondaryNav />, { initialState });

describe('<MhvSecondaryNav />', () => {
  it('renders', () => {
    const initialState = stateFn({ loading: false });
    const { getByRole } = setup({ initialState });
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.false;
    const mhvLink = getByRole('link', { name: /^My HealtheVet/ });
    expect(mhvLink.href).to.match(/my-health$/);
  });
});
