import { expect } from 'chai';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

// TODO: Add complete unit test suite for prescriptionsApi
describe('API base path', () => {
  it('should use v2 path when Cerner pilot flag is enabled', () => {
    const mockState = {
      featureToggles: {
        mhvMedicationsCernerPilot: true,
      },
    };
    const apiBasePath = mockState.featureToggles.mhvMedicationsCernerPilot
      ? `${environment.API_URL}/my_health/v2`
      : `${environment.API_URL}/my_health/v1`;
    expect(apiBasePath).to.equal(`${environment.API_URL}/my_health/v2`);
  });

  it('should use v1 path when Cerner pilot flag is disabled', () => {
    const mockState = {
      featureToggles: {
        mhvMedicationsCernerPilot: false,
      },
    };
    const apiBasePath = mockState.featureToggles.mhvMedicationsCernerPilot
      ? `${environment.API_URL}/my_health/v2`
      : `${environment.API_URL}/my_health/v1`;
    expect(apiBasePath).to.equal(`${environment.API_URL}/my_health/v1`);
  });
});
