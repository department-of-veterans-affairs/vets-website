import React from 'react';
import { expect } from 'chai';

import Header from '../../../../../../components/common/Header/Header';
import { renderTestApp } from '../../../../helpers';

describe('MobileHeader', () => {
  it('renders header on mobile', () => {
    const { getByTestId } = renderTestApp(<Header />);
    expect(getByTestId('mobile-header')).to.exist;
  });
});
