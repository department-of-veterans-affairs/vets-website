import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SecondaryRequiredAlert from '../../../../components/FormAlerts/SecondaryRequiredAlert';

describe('CG <SecondaryRequiredAlert>', () => {
  it('should render `va-alert` with status of `error`', () => {
    const { container } = render(<SecondaryRequiredAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'error');
  });
});
