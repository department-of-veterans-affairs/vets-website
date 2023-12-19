import React from 'react';
import { render } from '@testing-library/react';

import {
  SummaryDescription,
  SummaryTitle,
} from '../../content/ancillaryFormsWizardSummary';

describe('526 All Claims -- Ancillary forms wizard summary content', () => {
  it('should render only the appropriate panels', () => {
    const formData = {
      'view:modifyingHome': true,
      'view:modifyingCar': true,
      'view:aidAndAttendance': true,
      'view:unemployable': true,
      'view:unemployabilityUploadChoice': false,
    };
    const tree = render(<SummaryDescription formData={formData} />);
    tree.getByText('Adapted housing assistance');
    tree.getByText('Automobile allowance');
    tree.getByText('Aid and Attendance');
    tree.getByText('Individual Unemployability');
  });

  // for coverage
  it('renders summary title', () => {
    const tree = render(SummaryTitle());

    tree.getByText('Summary of additional benefits');
  });
});
