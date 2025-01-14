import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ConfirmationPage from '../../../../components/submit-flow/pages/ConfirmationPage';

it('should render', () => {
  const screen = render(<ConfirmationPage />);

  expect(screen.getByText('We’re processing your travel reimbursement claim'))
    .to.exist;
});
