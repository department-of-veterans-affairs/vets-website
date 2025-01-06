import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import MileagePage from '../../components/submit-flow/pages/MileagePage';

it('should render with back and continue buttons', () => {
  const props = {
    handlers: {
      onBack: () => {},
      onNext: () => {},
    },
  };
  const screen = render(<MileagePage {...props} />);

  expect(screen.getByText('Mileage page')).to.exist;
  expect($('va-button-pair')).to.exist;
});
