import { expect } from 'chai';
import sinon from 'sinon';
import { diff } from 'just-diff';
import { mockFetch, setFetchJSONFailure } from 'platform/testing/unit/helpers';

import { fetchFlowEligibilityAndClinics } from '../../../services/patient';
import { mockEligibilityFetchesByVersion } from '../../mocks/fetch';
import { createMockClinicByVersion } from '../../mocks/data';

describe('VAOS Patient service v0/v2 comparison', () => {
  describe('fetchFlowEligibilityAndClinics', () => {
    beforeEach(() => mockFetch());
    it('should match when all checks fail', async () => {
      // Given a non MH/PC type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };

      // And direct and request scheduling enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And no passing eligibility checks
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        version: 2,
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result.pastAppointments;
      delete v2Result.pastAppointments;

      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when clinics are fetched', async () => {
      // Given a non MH/PC type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };

      // And the user has available clinics
      const clinic = {
        // Changed to a invalid clinic id so eligibility check failed reasons will match
        id: '4555',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And direct and requests are enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And all non-clinic eligibility checks are failing
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        version: 2,
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result.pastAppointments;
      delete v2Result.pastAppointments;

      const differences = diff(v0Result, v2Result);

      expect(differences).to.be.empty;
    });

    it('should match when using primary care', async () => {
      // Given a type of care of PC or MH
      const typeOfCare = {
        id: '323',
        idV2: 'primaryCare',
      };

      // And the user has available clinics
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And direct and requests are enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '323': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And the non-clinics eligibility checks are failing
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'primaryCare',
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        version: 2,
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);
      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when requests and direct scheduling are disabled', async () => {
      // Given any type of care
      const typeOfCare = {
        id: '323',
        idV2: 'primaryCare',
      };

      // And the user has available clinics
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And eligibility checks are passing
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        pastClinics: true,
        requestPastVisits: true,
        directPastVisits: true,
        limit: true,
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        version: 2,
      });

      // And requests and direct are disabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '323': {
              direct: {
                enabled: false,
              },
              request: {
                enabled: false,
              },
            },
          },
        },
      };

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);
      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when there are errors', async () => {
      // Given a type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };

      // And any other eligibility conditions
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        version: 2,
      });
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And some checks return an error
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };
      setFetchJSONFailure(
        global.fetch.withArgs(sinon.match(`/vaos/v2/eligibility`)),
        {
          errors: [error],
        },
      );
      setFetchJSONFailure(global.fetch.withArgs(sinon.match(`/visits/`)), {
        errors: [error],
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result.pastAppointments;
      delete v2Result.pastAppointments;

      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when passing past clinic check', async () => {
      // Given a non MH/PC type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };

      // And the user has an available clinic
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And direct and requests are enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And there are past appointments matching an available clinic
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
        pastClinics: true,
        pastVisits: true,
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        pastClinics: true,
        version: 2,
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result.pastAppointments;
      delete v2Result.pastAppointments;

      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when DS is disabled by toggle', async () => {
      // Given a type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };

      // And the user has an available clinic
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And direct and requests are enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And direct eligibility checks are passing
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
        pastClinics: true,
        directPastVisits: true,
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        version: 2,
      });

      // And direct scheduling is disabled by feature toggle
      const directSchedulingEnabled = false;

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled,
          useV2: true,
        }),
      ]);
      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });

    it('should match when passing all checks', async () => {
      // Given a non MH/PC type of care
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };

      // And direct and requests enabled
      const location = {
        id: '983',
        vistaId: '983',
        legacyVAR: {
          settings: {
            '125': {
              direct: {
                enabled: true,
              },
              request: {
                enabled: true,
              },
            },
          },
        },
      };

      // And a user passing all eligibility checks
      const eligibility = {
        facilityId: '983',
        typeOfCareId: 'socialWork',
        pastClinics: true,
        requestPastVisits: true,
        directPastVisits: true,
        limit: true,
      };
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 0,
          }),
        ],
        version: 0,
      });
      mockEligibilityFetchesByVersion({
        ...eligibility,
        clinics: [
          createMockClinicByVersion({
            ...clinic,
            version: 2,
          }),
        ],
        pastClinics: true,
        version: 2,
      });

      // When we compare the eligibility check using v0 and v2
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          directSchedulingEnabled: true,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result.pastAppointments;
      delete v2Result.pastAppointments;

      const differences = diff(v0Result, v2Result);

      // Then both results are the same
      expect(differences).to.be.empty;
    });
  });
});
