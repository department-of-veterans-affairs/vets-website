import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import CantFilePage from '../../components/submit-flow/pages/CantFilePage';

it('should render with back button', () => {
  const props = {
    pageIndex: 2,
    setCantFile: () => {},
    setPageIndex: () => {},
  };
  const screen = render(<CantFilePage {...props} />);

  expect(
    screen.getByText('We can’t file this type of travel reimbursement claim'),
  ).to.exist;
  expect($('va-button[text="Back"]')).to.exist;
});
