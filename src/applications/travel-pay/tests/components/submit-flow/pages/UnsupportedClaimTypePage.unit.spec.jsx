import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import UnsupportedClaimTypePage from '../../../../components/submit-flow/pages/UnsupportedClaimTypePage';

it('should render with back button', () => {
  const props = {
    pageIndex: 2,
    setIsUnsupportedClaimType: () => {},
    setPageIndex: () => {},
  };
  const screen = render(<UnsupportedClaimTypePage {...props} />);

  expect(
    screen.getByText('We can’t file this type of travel reimbursement claim'),
  ).to.exist;
  expect($('va-button[text="Back"]')).to.exist;
});
