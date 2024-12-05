import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import OfficialGovtWebsite from '../../../../../components/common/Header/OfficialGovtWebsite';

describe('OfficialGovtWebsite', () => {
  const getOfficialGovtWebsiteMobile = () => render(<OfficialGovtWebsite />);

  it('renders toggle text on mobile', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    expect(getByTestId('official-govt-website-toggle').textContent).to.eq(
      'An official website of the United States government.',
    );
  });

  it('renders proper aria tag on click', () => {
    const { getByTestId } = getOfficialGovtWebsiteMobile();
    fireEvent.click(getByTestId('official-govt-website-toggle'));
    expect(
      getByTestId('official-govt-website-content').getAttribute(
        'aria-expanded',
      ),
    ).to.eq('false');
  });
});
