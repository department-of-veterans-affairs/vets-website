import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { describe, it } from 'mocha';
import sinon from 'sinon';

const WiderThanMobileLogoRow = () => (
  <div data-testid="wider-than-mobile-logo-row">Wider Than Mobile Logo Row</div>
);

const UserNav = () => (
  <div data-testid="user-nav-wider-than-mobile-sign-in-link">Sign in</div>
);

// Stubbing the actual imports with mocks
sinon
  .stub(
    require('../../../../../components/common/Header/common/UserNav'),
    'default',
  )
  .callsFake(UserNav);
sinon
  .stub(
    require('../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow'),
    'default',
  )
  .callsFake(WiderThanMobileLogoRow);

import WiderThanMobileHeader from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileHeader';

describe('WiderThanMobileHeader', () => {
  const getWiderThanMobileHeader = () =>
    render(
      <MemoryRouter>
        <WiderThanMobileHeader />
      </MemoryRouter>,
    );

  it('renders header on screens wider than mobile', () => {
    const { getByTestId } = getWiderThanMobileHeader();
    expect(getByTestId('wider-than-mobile-header')).to.exist;
  });
});
