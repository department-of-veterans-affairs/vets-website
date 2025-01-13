import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import VehiclePage from '../../../../components/submit-flow/pages/VehiclePage';

it('should render with back and continue buttons', () => {
  const props = {
    handlers: {
      onBack: () => {},
      onNext: () => {},
    },
  };
  const screen = render(<VehiclePage {...props} />);

  expect(screen.getByText('Vehicle page')).to.exist;
  expect($('va-button-pair')).to.exist;
});
