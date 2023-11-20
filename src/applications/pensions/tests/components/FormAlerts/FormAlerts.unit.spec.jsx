import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { MedicalEvidenceAlert } from '../../../components/FormAlerts';

describe('hca <MedicalEvidenceAlert>', () => {
  it('should render', () => {
    const { container } = render(<MedicalEvidenceAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});
