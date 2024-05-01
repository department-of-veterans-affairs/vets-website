import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';

describe('MobileHeader', () => {
  const getMobileHeader = () =>
    render(
      <MemoryRouter>
        <MobileHeader />
      </MemoryRouter>,
    );

  it('renders header on mobile', () => {
    const { getByTestId } = getMobileHeader();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
