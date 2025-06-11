import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { TrustSupplementaryFormsAlert } from '../../../components/FormAlerts';

describe('pension <TrustSupplementaryFormsAlert>', () => {
  it('should render', () => {
    const { container } = render(<TrustSupplementaryFormsAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'info');
  });
});
