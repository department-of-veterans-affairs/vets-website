import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import VeteranCrisisLine from '../../../../../components/common/Header/common/VeteranCrisisLine';

describe('VeteranCrisisLine mobile', () => {
  const getVeteranCrisisLineMobile = () =>
    render(<VeteranCrisisLine isMobile />);

  it('renders veteran crisis line button on mobile', () => {
    const { getByTestId } = getVeteranCrisisLineMobile();
    expect(getByTestId('veteran-crisis-line-button')).to.exist;
  });

  it('renders veteran crisis line text on mobile', () => {
    const { getByTestId } = getVeteranCrisisLineMobile();
    expect(getByTestId('veteran-crisis-line-text').textContent).to.eq(
      'Talk to the Veterans Crisis Line now',
    );
  });
});

describe('VeteranCrisisLine wider than mobile', () => {
  const getVeteranCrisisLineWider = () => render(<VeteranCrisisLine />);

  it('renders veteran crisis line button on screens wider than mobile', () => {
    const { getByTestId } = getVeteranCrisisLineWider();
    expect(getByTestId('veteran-crisis-line-button')).to.exist;
  });

  it('renders veteran crisis line text on screens wider than mobile', () => {
    const { getByTestId } = getVeteranCrisisLineWider();
    expect(getByTestId('veteran-crisis-line-text').textContent).to.eq(
      'Talk to the Veterans Crisis Line now',
    );
  });
});
