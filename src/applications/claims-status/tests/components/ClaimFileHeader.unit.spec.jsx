import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimFileHeader from '../../components/ClaimFileHeader';

describe('<ClaimFileHeader>', () => {
  it('should render a ClaimFileHeader section', () => {
    const { container } = render(<ClaimFileHeader />);
    expect($('.claim-file-header-container', container)).to.exist;
  });
});
