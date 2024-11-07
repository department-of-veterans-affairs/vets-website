import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import MobileHeader from '../../../../../../components/common/Header/MobileHeader/MobileHeader';
import { TestApp } from '../../../../helpers';

function renderTestApp({ initAction } = {}) {
  return render(
    <TestApp initAction={initAction}>
      <MobileHeader />
    </TestApp>,
  );
}

describe('MobileHeader', () => {
  it('renders header on mobile', () => {
    const { getByTestId } = renderTestApp();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
