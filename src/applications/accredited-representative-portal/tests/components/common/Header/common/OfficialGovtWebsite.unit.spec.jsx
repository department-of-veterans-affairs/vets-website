import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import OfficialGovtWebsite from '../../../../../components/common/Header/common/OfficialGovtWebsite';

describe('OfficialGovtWebsite mobile', () => {
  const getOfficialGovtWebsiteMobile = () =>
    render(<OfficialGovtWebsite isMobile />);

  it('renders toggle text on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    expect(
      getByTestId('official-govt-website-toggle-mobile').textContent,
    ).to.eq('An official website of the United States government');
  });

  it('renders content on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    expect(
      getByTestId('official-govt-website-content').getAttribute('aria-hidden'),
    ).to.eq('true');
    fireEvent.click(getByTestId('official-govt-website-toggle-mobile'));
    expect(
      getByTestId('official-govt-website-content').getAttribute('aria-hidden'),
    ).to.eq('false');
  });
});

describe('OfficialGovtWebsite wider than mobile', () => {
  const getOfficialGovtWebsiteWider = () => render(<OfficialGovtWebsite />);

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
      getByTestId('official-govt-website-content').getAttribute('aria-hidden'),
    ).to.eq('true');
    fireEvent.click(
      getByTestId('official-govt-website-toggle-wider-than-mobile'),
    );
    expect(
      getByTestId('official-govt-website-content').getAttribute('aria-hidden'),
    ).to.eq('false');
  });
});
