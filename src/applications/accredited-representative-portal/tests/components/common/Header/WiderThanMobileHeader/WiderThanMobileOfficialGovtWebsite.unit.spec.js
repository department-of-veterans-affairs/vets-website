import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileOfficialGovtWebsite from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileOfficialGovtWebsite';

describe('WiderThanMobileOfficialGovtWebsite', () => {
  const getOfficialGovtWebsiteWider = () =>
    render(<WiderThanMobileOfficialGovtWebsite />);

  it('renders toggle text on screens wider than mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteWider();
    expect(
      getByTestId('official-govt-website-toggle-wider-than-mobile-text')
        .textContent,
    ).to.eq('Here’s how you know');
  });

  it('renders content on screens wider than mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteWider();
    expect(
      getByTestId(
        'official-govt-website-content-wider-than-mobile',
      ).getAttribute('aria-hidden'),
    ).to.eq('true');
    fireEvent.click(
      getByTestId('official-govt-website-toggle-wider-than-mobile'),
    );
    expect(
      getByTestId(
        'official-govt-website-content-wider-than-mobile',
      ).getAttribute('aria-hidden'),
    ).to.eq('false');
  });
});
