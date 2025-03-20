import { expect } from 'chai';
import { parseAccountSummary } from '../../../util/txtHelpers/accountSummary';

const records = {
  authenticationSummary: {
    source: 'Source 1',
    authenticationStatus: 'Status 1',
    authenticationDate: 'Date 1',
    authenticationFacilityName: 'Facility 1',
    authenticationFacilityID: '1',
  },
  vaTreatmentFacilities: [
    {
      facilityName: 'Facility 1',
      type: 'VAMC',
    },
  ],
};

describe('parseAccountSummary', () => {
  it('should process details section correctly', () => {
    const result = parseAccountSummary(records);
    expect(result).to.include('Source: Source 1');
    expect(result).to.include('Authentication facility ID: 1');
  });

  it('should process results section correctly', () => {
    const result = parseAccountSummary(records);
    expect(result).to.include('VA Treatment Facilities:');
    expect(result).to.include('Facility 1:');
    expect(result).to.include('Type: VAMC');
  });

  it('should handle missing titles or values gracefully', () => {
    const incompleteRecords = {
      authenticationSummary: {
        source: '',
        authenticationStatus: '',
        authenticationDate: '',
        authenticationFacilityName: '',
        authenticationFacilityID: '',
      },
      vaTreatmentFacilities: [
        {
          facilityName: '',
          type: '',
        },
      ],
    };
    const result = parseAccountSummary(incompleteRecords);
    expect(result).to.include('Unknown Facility');
    expect(result).to.include('Type: No information provided');
    expect(result).to.include('VA Treatment Facilities:');
  });
});
