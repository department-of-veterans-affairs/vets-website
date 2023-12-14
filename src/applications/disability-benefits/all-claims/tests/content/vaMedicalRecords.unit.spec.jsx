import { render } from '@testing-library/react';
import { treatmentView } from '../../content/vaMedicalRecords';

describe('vamedicalRecordsDescription', () => {
  it('renders with treatment center name', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = render(treatmentView({ formData }));
    result.getByText('Test Facility');
  });

  it('renders date as MMMM YYYY', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = render(treatmentView({ formData }));
    result.getByText('January 2018');
  });
});
