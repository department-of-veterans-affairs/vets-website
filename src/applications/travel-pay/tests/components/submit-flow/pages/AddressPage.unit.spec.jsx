import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import AddressPage from '../../../../components/submit-flow/pages/AddressPage';

it('should render with back and continue buttons', () => {
  const props = {
    handlers: {
      onBack: () => {},
      onNext: () => {},
    },
  };
  const screen = render(<AddressPage {...props} />);

  expect(screen.getByText('Address page')).to.exist;
  expect($('va-button-pair')).to.exist;
});
