import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  MedicalEvidenceAlert,
  SpecialMonthlyPensionEvidenceAlert,
} from '../../../../components/FormAlerts';

describe('pension <MedicalEvidenceAlert>', () => {
  it('should render', () => {
    const { container } = render(<MedicalEvidenceAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});

describe('pension <SpecialMonthlyPensionEvidenceAlert>', () => {
  it('should render', () => {
    const { container } = render(<SpecialMonthlyPensionEvidenceAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});
