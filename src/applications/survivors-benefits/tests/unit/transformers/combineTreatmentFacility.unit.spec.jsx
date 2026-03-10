import { expect } from 'chai';
import { combineTreatmentFacility } from '../../../utils/transformers/combineTreatmentFacility';

describe('combineTreatmentFacility', () => {
  it('combines facility information with 2025 version enabled', () => {
    const input = JSON.stringify({
      survivorsBenefitsForm2025VersionEnabled: true,
      treatments: [
        {
          vaMedicalCenterName: 'VA Boston Healthcare System',
          city: 'Boston',
          state: 'MA',
          startDate: '2023-01-15',
          endDate: '2023-03-20',
        },
      ],
    });

    const result = JSON.parse(combineTreatmentFacility(input));
    expect(result.treatments[0].facility).to.equal(
      'VA Boston Healthcare System',
    );
    expect(result.treatments[0].facilityLocation).to.equal('Boston, MA');
    expect(result.treatments[0].treatmentDates).to.deep.equal({
      start: '2023-01-15',
      end: '2023-03-20',
    });
  });

  it('combines facility information without 2025 version enabled', () => {
    const input = JSON.stringify({
      survivorsBenefitsForm2025VersionEnabled: false,
      treatments: [
        {
          vaMedicalCenterName: 'VA Boston Healthcare System',
          city: 'Boston',
          state: 'MA',
          startDate: '2023-01-15',
          endDate: '2023-03-20',
        },
      ],
    });

    const result = JSON.parse(combineTreatmentFacility(input));
    expect(result.treatments[0].facility).to.equal(
      'VA Boston Healthcare System - Boston, MA',
    );
    expect(result.treatments[0].treatmentDates).to.deep.equal({
      start: '2023-01-15',
      end: '2023-03-20',
    });
  });
});
