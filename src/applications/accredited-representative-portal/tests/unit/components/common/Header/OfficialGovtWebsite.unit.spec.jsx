import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import OfficialGovtWebsite from '../../../../../components/common/Header/OfficialGovtWebsite';

describe('OfficialGovtWebsite', () => {
  const getOfficialGovtWebsiteMobile = () => render(<OfficialGovtWebsite />);

  it('renders toggle text on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    expect(getByTestId('official-govt-site-text').textContent).to.eq(
      'An official website of the United States government.',
    );
  });

  it('renders proper aria tag on click', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    fireEvent.click(getByTestId('official-govt-site-toggle'));
    expect(
      getByTestId('official-govt-site-content').getAttribute('aria-hidden'),
    ).to.eq('false');
  });
});
