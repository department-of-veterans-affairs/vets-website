import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { describe, it } from 'mocha';
import sinon from 'sinon';

const OfficialGovtWebsite = () => <div data-testid="official-govt-website" />;
const VeteranCrisisLine = () => <div data-testid="veteran-crisis-line" />;
const MobileLogoRow = () => <div data-testid="mobile-logo-row" />;

sinon
  .stub(
    require('../../../../../components/common/Header/common/OfficialGovtWebsite'),
    'default',
  )
  .callsFake(OfficialGovtWebsite);
sinon
  .stub(
    require('../../../../../components/common/Header/common/VeteranCrisisLine'),
    'default',
  )
  .callsFake(VeteranCrisisLine);
sinon
  .stub(
    require('../../../../../components/common/Header/MobileHeader/MobileLogoRow'),
    'default',
  )
  .callsFake(MobileLogoRow);

import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';

describe('MobileHeader', () => {
  const getMobileHeader = () =>
    render(
      <MemoryRouter>
        <MobileHeader />
      </MemoryRouter>,
    );

  it('renders header on mobile', () => {
    const { getByTestId } = getMobileHeader();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
