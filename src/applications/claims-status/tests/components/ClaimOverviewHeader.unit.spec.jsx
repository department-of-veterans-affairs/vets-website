import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimOverviewHeader from '../../components/ClaimOverviewHeader';

describe('<ClaimOverviewHeader>', () => {
  it('should render a ClaimOverviewHeader section', () => {
    const { container } = render(<ClaimOverviewHeader />);
    expect($('.claim-overview-header-container', container)).to.exist;
  });
});
