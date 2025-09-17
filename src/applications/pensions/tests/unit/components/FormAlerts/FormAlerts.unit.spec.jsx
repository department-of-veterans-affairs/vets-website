import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { SpecialMonthlyPensionEvidenceAlert } from '../../../../components/FormAlerts';

describe('pension <SpecialMonthlyPensionEvidenceAlert>', () => {
  it('should render', () => {
    const { container } = render(<SpecialMonthlyPensionEvidenceAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});
