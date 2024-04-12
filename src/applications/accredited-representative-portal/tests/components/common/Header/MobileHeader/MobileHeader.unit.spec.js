import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';

describe('MobileHeader', () => {
  const getMobileHeader = () => render(<MobileHeader />);

  it('renders header on mobile', () => {
    const { getByTestId } = getMobileHeader();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
