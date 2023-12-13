import { render } from '@testing-library/react';
import { treatmentView } from '../../content/vaMedicalRecords';

describe('vamedicalRecordsDescription', () => {
  it('renders name as strong', () => {
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

  it('renders empty date if no date', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: undefined,
      },
    };
    const result = render(treatmentView({ formData }));
    result.getAllByText('', { exact: false });
  });
});
