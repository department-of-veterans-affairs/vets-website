import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../../../components/submit-flow/pages/IntroductionPage';

const appointment = require('../../../fixtures/appointment.json');

it('should render with link to file a claim', () => {
  const props = {
    appointment,
    onNext: () => {},
  };
  const screen = render(<IntroductionPage {...props} />);

  expect(screen.getByText('File a travel reimbursement claim')).to.exist;
  expect(
    screen.getByText(
      /Monday, December 30, 2024 at Cheyenne VA Medical Center/i,
    ),
  ).to.exist;
  expect($('va-link-action[text="File a mileage only claim"]')).to.exist;
});
