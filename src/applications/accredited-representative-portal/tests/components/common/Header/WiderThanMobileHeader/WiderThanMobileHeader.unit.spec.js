import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileHeader from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileHeader';

describe('WiderThanMobileHeader', () => {
  const getWiderThanMobileHeader = () => render(<WiderThanMobileHeader />);

  it('renders header on screens wider than mobile', () => {
    const { getByTestId } = getWiderThanMobileHeader();
    expect(getByTestId('wider-than-mobile-header')).to.exist;
  });
});
