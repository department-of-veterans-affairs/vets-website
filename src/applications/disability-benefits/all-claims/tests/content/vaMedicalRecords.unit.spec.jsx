import { expect } from 'chai';
import { treatmentView } from '../../content/vaMedicalRecords';

describe('vamedicalRecordsDescription', () => {
  it('renders div with three children', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = treatmentView({ formData });
    expect(result.props.children.length).to.equal(3);
  });

  it('renders name as strong', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = treatmentView({ formData });
    expect(result.props.children[0].type).to.equal('strong');
  });

  it('renders date as MMMM YYYY', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = treatmentView({ formData });
    expect(result.props.children[2]).to.equal('January 2018');
  });

  it('renders empty date if no date', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '',
      },
    };
    const result = treatmentView({ formData });
    expect(result.props.children[2]).to.equal('');
  });

  it('renders name as provided in formData', () => {
    const formData = {
      treatmentCenterName: 'Test Facility',
      treatmentDateRange: {
        from: '2018-01-XX',
      },
    };
    const result = treatmentView({ formData });
    expect(result.props.children[0].props.children).to.equal('Test Facility');
  });
});
