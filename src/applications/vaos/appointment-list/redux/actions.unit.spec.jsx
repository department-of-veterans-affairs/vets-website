import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  fetchFacilitySettings,
  FETCH_FACILITY_SETTINGS,
  FETCH_FACILITY_SETTINGS_SUCCEEDED,
  FETCH_FACILITY_SETTINGS_FAILED,
} from './actions';
import { mockSchedulingConfigurationsApi } from '../../tests/mocks/mockApis';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
  MockVaServiceConfiguration,
} from '../../tests/fixtures/MockSchedulingConfigurationResponse';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';

describe('VAOS appointment-list redux actions', () => {
  describe('fetchFacilitySettings', () => {
    beforeEach(() => {
      mockFetch();
    });

    const createState = (useVpg = false) => ({
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '984', isCerner: false },
          ],
        },
      },
      featureToggles: {
        vaOnlineSchedulingUseVpg: useVpg,
      },
    });

    it('should dispatch FETCH_FACILITY_SETTINGS and FETCH_FACILITY_SETTINGS_SUCCEEDED', async () => {
      // Arrange
      const dispatch = sinon.spy();
      const state = createState(false);
      const getState = () => state;

      mockSchedulingConfigurationsApi({
        facilityIds: ['983', '984'],
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                directEnabled: false,
              }),
            ],
          }),
        ],
      });

      // Act
      const thunk = fetchFacilitySettings();
      await thunk(dispatch, getState);

      // Assert
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FETCH_FACILITY_SETTINGS,
      });
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_FACILITY_SETTINGS_SUCCEEDED,
      );
      expect(dispatch.secondCall.args[0].settings).to.be.an('array');
    });

    it('should pass useVpg=false to getLocationSettings when feature flag is disabled', async () => {
      // Arrange
      const dispatch = sinon.spy();
      const state = createState(false);
      const getState = () => state;

      mockSchedulingConfigurationsApi({
        facilityIds: ['983', '984'],
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                directEnabled: true,
              }),
            ],
          }),
        ],
      });

      // Act
      const thunk = fetchFacilitySettings();
      await thunk(dispatch, getState);

      // Assert
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_FACILITY_SETTINGS_SUCCEEDED,
      );
      // Settings should use services format (legacy) when useVpg is false
      const { settings } = dispatch.secondCall.args[0];
      expect(settings).to.be.an('array');
    });

    it('should pass useVpg=true to getLocationSettings when feature flag is enabled', async () => {
      // Arrange
      const dispatch = sinon.spy();
      const state = createState(true);
      const getState = () => state;

      mockSchedulingConfigurationsApi({
        facilityIds: ['983', '984'],
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                directEnabled: true,
              }),
            ],
            vaServices: [
              new MockVaServiceConfiguration({
                clinicalServiceId: 'covid',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
        ],
      });

      // Act
      const thunk = fetchFacilitySettings();
      await thunk(dispatch, getState);

      // Assert
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_FACILITY_SETTINGS_SUCCEEDED,
      );
      // Settings should use vaServices format (VPG) when useVpg is true
      const { settings } = dispatch.secondCall.args[0];
      expect(settings).to.be.an('array');
    });

    it('should dispatch FETCH_FACILITY_SETTINGS_FAILED on error', async () => {
      // Arrange
      const dispatch = sinon.spy();
      const state = createState(false);
      const getState = () => state;

      mockSchedulingConfigurationsApi({
        facilityIds: ['983', '984'],
        response: [],
        responseCode: 500,
      });

      // Act
      const thunk = fetchFacilitySettings();
      await thunk(dispatch, getState);

      // Assert
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FETCH_FACILITY_SETTINGS,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FETCH_FACILITY_SETTINGS_FAILED,
      });
    });
  });
});
