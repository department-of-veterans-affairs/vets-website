import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import SubmissionErrorPage from '../../../../components/submit-flow/pages/SubmissionErrorPage';

it('should render with back button', () => {
  const screen = render(<SubmissionErrorPage />);

  expect(screen.getByText('We couldn’t file your claim')).to.exist;
});
