/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import DisplayOhTransitionAlert from '../../../components/shared/DisplayOhTransitionAlert';

describe('DisplayOhTransitionAlert component', () => {
  const drupalCernerFacilitiesData = {
    vamcEhrData: {
      data: {
        cernerFacilities: [
          { vhaId: '757', ehr: 'cerner' },
          { vhaId: '653', ehr: 'cerner' },
          { vhaId: '687', ehr: 'cerner' },
          { vhaId: '692', ehr: 'cerner' },
          { vhaId: '668', ehr: 'cerner' },
          { vhaId: '556', ehr: 'cerner' },
        ],
        ehrDataByVhaId: {
          757: { vhaId: '757', ehr: 'cerner', vamcSystemName: 'Columbus VA' },
          653: { vhaId: '653', ehr: 'cerner', vamcSystemName: 'Roseburg VA' },
          687: {
            vhaId: '687',
            ehr: 'cerner',
            vamcSystemName: 'Walla Walla VA',
          },
          692: { vhaId: '692', ehr: 'cerner', vamcSystemName: 'White City VA' },
          668: { vhaId: '668', ehr: 'cerner', vamcSystemName: 'Spokane VA' },
          556: {
            vhaId: '556',
            ehr: 'cerner',
            vamcSystemName: 'North Chicago VA',
          },
        },
      },
      loading: false,
    },
  };

  const baseState = {
    featureToggles: {
      loading: false,
      mhv_secure_messaging_oh_transition_alert: false,
      mhv_secure_messaging_milestone_2_aal: true,
    },
    drupalStaticData: drupalCernerFacilitiesData,
    sm: {
      folders: { folder: { folderId: 0, name: 'Inbox' } },
    },
  };

  const setup = (cernerFacilities, customState = {}) => {
    return renderWithStoreAndRouter(
      <DisplayOhTransitionAlert cernerFacilities={cernerFacilities} />,
      {
        initialState: { ...baseState, ...customState },
        reducers: reducer,
      },
    );
  };

  describe('when feature flag is ON and user has VHA_757', () => {
    it('renders blue OhTransitionAlert', () => {
      const cernerFacilities = [{ facilityId: '757' }];
      const { getByTestId, queryByTestId } = setup(cernerFacilities, {
        featureToggles: {
          loading: false,
          mhv_secure_messaging_oh_transition_alert: true,
          mhv_secure_messaging_milestone_2_aal: true,
        },
      });

      expect(getByTestId('oh-transition-alert')).to.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders blue alert when user has VHA_757 plus other OH facilities', () => {
      const cernerFacilities = [
        { facilityId: '757' },
        { facilityId: '653' },
        { facilityId: '668' },
      ];
      const { getByTestId, queryByTestId } = setup(cernerFacilities, {
        featureToggles: {
          loading: false,
          mhv_secure_messaging_oh_transition_alert: true,
          mhv_secure_messaging_milestone_2_aal: true,
        },
      });

      expect(getByTestId('oh-transition-alert')).to.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('when feature flag is OFF and user has VHA_757', () => {
    it('renders yellow CernerFacilityAlert', () => {
      const cernerFacilities = [{ facilityId: '757' }];
      const { getByTestId, queryByTestId } = setup(cernerFacilities, {
        featureToggles: {
          loading: false,
          mhv_secure_messaging_oh_transition_alert: false,
          mhv_secure_messaging_milestone_2_aal: true,
        },
      });

      expect(getByTestId('cerner-facilities-alert')).to.exist;
      expect(queryByTestId('oh-transition-alert')).to.not.exist;
    });
  });

  describe('when user has other OH facilities but not VHA_757', () => {
    it('renders yellow CernerFacilityAlert when flag is ON', () => {
      const cernerFacilities = [{ facilityId: '653' }, { facilityId: '668' }];
      const { getByTestId, queryByTestId } = setup(cernerFacilities, {
        featureToggles: {
          loading: false,
          mhv_secure_messaging_oh_transition_alert: true,
          mhv_secure_messaging_milestone_2_aal: true,
        },
      });

      expect(getByTestId('cerner-facilities-alert')).to.exist;
      expect(queryByTestId('oh-transition-alert')).to.not.exist;
    });

    it('renders yellow CernerFacilityAlert when flag is OFF', () => {
      const cernerFacilities = [{ facilityId: '653' }];
      const { getByTestId, queryByTestId } = setup(cernerFacilities, {
        featureToggles: {
          loading: false,
          mhv_secure_messaging_oh_transition_alert: false,
          mhv_secure_messaging_milestone_2_aal: true,
        },
      });

      expect(getByTestId('cerner-facilities-alert')).to.exist;
      expect(queryByTestId('oh-transition-alert')).to.not.exist;
    });
  });

  describe('when user has no OH facilities', () => {
    it('renders nothing', () => {
      const cernerFacilities = [];
      const { queryByTestId } = setup(cernerFacilities);

      expect(queryByTestId('oh-transition-alert')).to.not.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders nothing when cernerFacilities is undefined', () => {
      const { queryByTestId } = setup(undefined);

      expect(queryByTestId('oh-transition-alert')).to.not.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('renders nothing when cernerFacilities is null', () => {
      const { queryByTestId } = setup(null);

      expect(queryByTestId('oh-transition-alert')).to.not.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('when user has non-OH facilities only', () => {
    it('renders nothing', () => {
      const cernerFacilities = [{ facilityId: '999' }, { facilityId: '888' }];
      const { queryByTestId } = setup(cernerFacilities);

      expect(queryByTestId('oh-transition-alert')).to.not.exist;
      expect(queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });
});
