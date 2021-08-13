import { expect } from 'chai';
import sinon from 'sinon';
import { diff } from 'just-diff';
import { mockFetch, setFetchJSONFailure } from 'platform/testing/unit/helpers';

import { fetchFlowEligibilityAndClinics } from '../../../services/patient';
import { mockEligibilityFetchesByVersion } from '../../mocks/fetch';
import { createMockClinicByVersion } from '../../mocks/data';

describe('VAOS Patient service', () => {
  describe('fetchFlowEligibilityAndClinics', () => {
    beforeEach(() => mockFetch());
    it('should match when all checks fail', async () => {
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
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      expect(differences).to.be.empty;
    });

    it('should match when clinics are fetched', async () => {
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
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      expect(differences).to.be.empty;
    });

    it('should match when using primary care', async () => {
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
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
      const typeOfCare = {
        id: '323',
        idV2: 'primaryCare',
      };
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
      expect(differences).to.be.empty;
    });

    it('should match when requests and direct scheduling are disabled', async () => {
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
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
      const typeOfCare = {
        id: '323',
        idV2: 'primaryCare',
      };
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
      expect(differences).to.be.empty;
    });

    it('should match when there are errors', async () => {
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
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };
      setFetchJSONFailure(
        global.fetch.withArgs(sinon.match(`/vaos/v2/patient`)),
        {
          errors: [error],
        },
      );
      setFetchJSONFailure(global.fetch.withArgs(sinon.match(`/visits/`)), {
        errors: [error],
      });

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
      expect(differences).to.be.empty;
    });

    it('should match when passing past clinic check', async () => {
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
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
        version: 2,
      });
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      expect(differences).to.be.empty;
    });

    it('should match with DS is disabled by flag', async () => {
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
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
        version: 2,
      });
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      const [v0Result, v2Result] = await Promise.all([
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          useV2: false,
        }),
        fetchFlowEligibilityAndClinics({
          typeOfCare,
          location,
          useV2: true,
        }),
      ]);
      const differences = diff(v0Result, v2Result);
      expect(differences).to.be.empty;
    });

    it('should match when passing all checks', async () => {
      const clinic = {
        id: '455',
        stationId: '983',
        name: 'BAD NAME',
        friendlyName: 'Clinic name',
      };
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
        version: 2,
      });
      const typeOfCare = {
        id: '125',
        idV2: 'socialWork',
      };
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
      expect(differences).to.be.empty;
    });
  });
});
