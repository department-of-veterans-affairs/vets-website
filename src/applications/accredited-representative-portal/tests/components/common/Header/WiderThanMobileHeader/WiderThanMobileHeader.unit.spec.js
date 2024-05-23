import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

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
