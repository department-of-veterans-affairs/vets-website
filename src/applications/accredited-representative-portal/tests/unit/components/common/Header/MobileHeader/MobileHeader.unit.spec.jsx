import React from 'react';
import { expect } from 'chai';

import MobileHeader from '../../../../../../components/common/Header/MobileHeader/MobileHeader';
import { renderTestApp } from '../../../../helpers';

describe('MobileHeader', () => {
  it('renders header on mobile', () => {
    const { getByTestId } = renderTestApp(<MobileHeader />);
    expect(getByTestId('mobile-header')).to.exist;
  });
});
