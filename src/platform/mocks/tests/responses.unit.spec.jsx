import { expect } from 'chai';

const {
  createUserResponse,
  mockUser,
  mockUserUnauthenticated,
  createFeatureTogglesResponse,
  mockFeatureToggles,
  createMaintenanceWindowsResponse,
  mockMaintenanceWindows,
  createVamcEhrResponse,
  mockVamcEhr,
} = require('../responses');

describe('platform/mocks/responses', () => {
  describe('createUserResponse', () => {
    it('should return default user response when called with no arguments', () => {
      const result = createUserResponse();

      expect(result.data.type).to.equal('users');
      expect(result.data.attributes.profile.firstName).to.equal('Test');
      expect(result.data.attributes.profile.lastName).to.equal('User');
      expect(result.data.attributes.profile.email).to.equal('test@example.com');
      expect(result.data.attributes.profile.loa.current).to.equal(3);
      expect(result.data.attributes.profile.signIn.serviceName).to.equal(
        'idme',
      );
      expect(result.data.attributes.veteranStatus.isVeteran).to.be.true;
      expect(result.meta.errors).to.be.null;
    });

    it('should deep merge nested profile overrides', () => {
      const result = createUserResponse({
        data: {
          attributes: {
            profile: {
              firstName: 'Jane',
              signIn: { serviceName: 'logingov' },
            },
          },
        },
      });

      // Overridden values
      expect(result.data.attributes.profile.firstName).to.equal('Jane');
      expect(result.data.attributes.profile.signIn.serviceName).to.equal(
        'logingov',
      );

      // Preserved nested values (deep merge)
      expect(result.data.attributes.profile.signIn.ssoe).to.be.true;
      expect(result.data.attributes.profile.signIn.transactionid).to.equal(
        'mock-tx',
      );

      // Other defaults preserved
      expect(result.data.attributes.profile.lastName).to.equal('User');
      expect(result.data.attributes.profile.email).to.equal('test@example.com');
    });

    it('should deep merge loa overrides', () => {
      const result = createUserResponse({
        data: {
          attributes: {
            profile: {
              loa: { current: 1 },
            },
          },
        },
      });

      expect(result.data.attributes.profile.loa.current).to.equal(1);
      // Other profile defaults preserved
      expect(result.data.attributes.profile.firstName).to.equal('Test');
    });

    it('should deep merge veteranStatus overrides', () => {
      const result = createUserResponse({
        data: {
          attributes: {
            veteranStatus: {
              isVeteran: false,
            },
          },
        },
      });

      expect(result.data.attributes.veteranStatus.isVeteran).to.be.false;
      // Other veteranStatus defaults preserved
      expect(result.data.attributes.veteranStatus.status).to.equal('OK');
      expect(result.data.attributes.veteranStatus.servedInMilitary).to.be.true;
    });

    it('should replace arrays instead of merging by index', () => {
      const customServices = ['custom-service-1', 'custom-service-2'];
      const result = createUserResponse({
        data: {
          attributes: {
            services: customServices,
          },
        },
      });

      expect(result.data.attributes.services).to.deep.equal(customServices);
      expect(result.data.attributes.services).to.have.lengthOf(2);
    });

    it('should handle inProgressForms array override', () => {
      const forms = [{ form: '21-526EZ', lastUpdated: 1234567890 }];
      const result = createUserResponse({
        data: {
          attributes: {
            inProgressForms: forms,
          },
        },
      });

      expect(result.data.attributes.inProgressForms).to.deep.equal(forms);
    });

    it('should not mutate the default user object', () => {
      const originalFirstName = mockUser.data.attributes.profile.firstName;

      createUserResponse({
        data: {
          attributes: {
            profile: {
              firstName: 'Modified',
            },
          },
        },
      });

      expect(mockUser.data.attributes.profile.firstName).to.equal(
        originalFirstName,
      );
    });

    it('should handle multiple levels of nesting', () => {
      const result = createUserResponse({
        data: {
          id: 'custom-id',
          attributes: {
            profile: {
              firstName: 'Custom',
              vaProfile: { status: 'NOT_FOUND' },
            },
            vaProfile: {
              status: 'SERVER_ERROR',
            },
          },
        },
      });

      expect(result.data.id).to.equal('custom-id');
      expect(result.data.attributes.profile.firstName).to.equal('Custom');
      expect(result.data.attributes.vaProfile.status).to.equal('SERVER_ERROR');
    });
  });

  describe('mockUser', () => {
    it('should be a valid default user response', () => {
      expect(mockUser.data.type).to.equal('users');
      expect(mockUser.data.attributes.profile).to.exist;
      expect(mockUser.data.attributes.veteranStatus).to.exist;
      expect(mockUser.meta).to.exist;
    });
  });

  describe('mockUserUnauthenticated', () => {
    it('should have correct 401 error structure', () => {
      expect(mockUserUnauthenticated.errors).to.be.an('array');
      expect(mockUserUnauthenticated.errors[0].status).to.equal('401');
      expect(mockUserUnauthenticated.errors[0].code).to.equal('401');
      expect(mockUserUnauthenticated.errors[0].title).to.equal(
        'Not authorized',
      );
    });
  });

  describe('createFeatureTogglesResponse', () => {
    it('should return empty features array when called with no arguments', () => {
      const result = createFeatureTogglesResponse();

      expect(result.data.type).to.equal('feature_toggles');
      expect(result.data.features).to.deep.equal([]);
    });

    it('should create features array from toggles object', () => {
      const result = createFeatureTogglesResponse({
        myFeatureFlag: true,
        anotherFlag: false,
        thirdFlag: true,
      });

      expect(result.data.type).to.equal('feature_toggles');
      expect(result.data.features).to.have.lengthOf(3);

      const myFeature = result.data.features.find(
        f => f.name === 'myFeatureFlag',
      );
      expect(myFeature.value).to.be.true;

      const anotherFeature = result.data.features.find(
        f => f.name === 'anotherFlag',
      );
      expect(anotherFeature.value).to.be.false;
    });

    it('should handle empty object', () => {
      const result = createFeatureTogglesResponse({});

      expect(result.data.features).to.deep.equal([]);
    });
  });

  describe('mockFeatureToggles', () => {
    it('should be an empty feature toggles response', () => {
      expect(mockFeatureToggles.data.type).to.equal('feature_toggles');
      expect(mockFeatureToggles.data.features).to.deep.equal([]);
    });
  });

  describe('createMaintenanceWindowsResponse', () => {
    it('should return empty data array when called with no arguments', () => {
      const result = createMaintenanceWindowsResponse();

      expect(result.data).to.deep.equal([]);
    });

    it('should return windows array as data', () => {
      const windows = [
        {
          id: 1,
          externalService: 'mhv',
          startTime: '2026-02-05T00:00:00Z',
          endTime: '2026-02-05T04:00:00Z',
        },
        {
          id: 2,
          externalService: 'evss',
          startTime: '2026-02-06T00:00:00Z',
          endTime: '2026-02-06T02:00:00Z',
        },
      ];

      const result = createMaintenanceWindowsResponse(windows);

      expect(result.data).to.deep.equal(windows);
      expect(result.data).to.have.lengthOf(2);
    });
  });

  describe('mockMaintenanceWindows', () => {
    it('should be an empty maintenance windows response', () => {
      expect(mockMaintenanceWindows.data).to.deep.equal([]);
    });
  });

  describe('createVamcEhrResponse', () => {
    it('should return empty entities when called with no arguments', () => {
      const result = createVamcEhrResponse();

      expect(result.data.nodeQuery.count).to.equal(0);
      expect(result.data.nodeQuery.entities).to.deep.equal([]);
    });

    it('should create correct entity structure from facilities array', () => {
      const facilities = [
        { id: 'vha_663', title: 'Seattle VA', system: 'vista' },
        { id: 'vha_687', title: 'Walla Walla VA', system: 'cerner' },
      ];

      const result = createVamcEhrResponse(facilities);

      expect(result.data.nodeQuery.count).to.equal(2);
      expect(result.data.nodeQuery.entities).to.have.lengthOf(2);

      const seattleEntity = result.data.nodeQuery.entities[0];
      expect(seattleEntity.title).to.equal('Seattle VA');
      expect(seattleEntity.fieldFacilityLocatorApiId).to.equal('vha_663');
      expect(seattleEntity.fieldRegionPage.entity.title).to.equal('Seattle VA');
      expect(seattleEntity.fieldRegionPage.entity.fieldVamcEhrSystem).to.equal(
        'vista',
      );

      const wallaWallaEntity = result.data.nodeQuery.entities[1];
      expect(
        wallaWallaEntity.fieldRegionPage.entity.fieldVamcEhrSystem,
      ).to.equal('cerner');
    });

    it('should use regionTitle when provided', () => {
      const facilities = [
        {
          id: 'vha_663',
          title: 'Seattle VA Medical Center',
          regionTitle: 'VA Puget Sound',
          system: 'vista',
        },
      ];

      const result = createVamcEhrResponse(facilities);

      const entity = result.data.nodeQuery.entities[0];
      expect(entity.title).to.equal('Seattle VA Medical Center');
      expect(entity.fieldRegionPage.entity.title).to.equal('VA Puget Sound');
    });

    it('should default system to vista when not provided', () => {
      const facilities = [{ id: 'vha_663', title: 'Seattle VA' }];

      const result = createVamcEhrResponse(facilities);

      expect(
        result.data.nodeQuery.entities[0].fieldRegionPage.entity
          .fieldVamcEhrSystem,
      ).to.equal('vista');
    });

    it('should handle empty array', () => {
      const result = createVamcEhrResponse([]);

      expect(result.data.nodeQuery.count).to.equal(0);
      expect(result.data.nodeQuery.entities).to.deep.equal([]);
    });
  });

  describe('mockVamcEhr', () => {
    it('should be an empty VAMC EHR response', () => {
      expect(mockVamcEhr.data.nodeQuery.count).to.equal(0);
      expect(mockVamcEhr.data.nodeQuery.entities).to.deep.equal([]);
    });
  });
});
