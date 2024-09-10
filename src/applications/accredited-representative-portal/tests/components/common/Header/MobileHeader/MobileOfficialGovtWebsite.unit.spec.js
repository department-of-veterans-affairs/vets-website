import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import MobileOfficialGovtWebsite from '../../../../../components/common/Header/MobileHeader/MobileOfficialGovtWebsite';

describe('MobileOfficialGovtWebsite', () => {
  const getOfficialGovtWebsiteMobile = () =>
    render(<MobileOfficialGovtWebsite />);

  it('renders toggle text on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    expect(
      getByTestId('official-govt-website-toggle-mobile').textContent,
    ).to.eq('An official website of the United States government.');
  });

  it('renders content on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    fireEvent.click(getByTestId('official-govt-website-toggle-mobile'));
    expect(
      getByTestId('official-govt-website-content-mobile').getAttribute(
        'aria-hidden',
      ),
    ).to.eq('false');
  });
});
