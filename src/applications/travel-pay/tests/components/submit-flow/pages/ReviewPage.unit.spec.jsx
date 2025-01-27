import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ReviewPage from '../../../../components/submit-flow/pages/ReviewPage';

it('should render with back and submit buttons', () => {
  const props = {
    handlers: {
      onBack: () => {},
      onSubmit: () => {},
    },
  };
  const screen = render(<ReviewPage {...props} />);

  expect(screen.getByText('Review your travel claim')).to.exist;
  expect($('va-button[text="Back"')).to.exist;
  expect($('va-button[text="Submit"')).to.exist;
});
