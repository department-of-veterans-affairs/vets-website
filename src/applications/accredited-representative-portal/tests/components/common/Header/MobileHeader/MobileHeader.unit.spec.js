import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';

describe('MobileHeader', () => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      accredited_representative_portal_pilot: true,
      loading: false,
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
  };
  const getMobileHeader = () =>
  renderInReduxProvider(
      <MemoryRouter>
        <MobileHeader />
      </MemoryRouter>,
      {
        initialState,
      },
    );

  it('renders header on mobile', () => {
    const { getByTestId } = getMobileHeader();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
