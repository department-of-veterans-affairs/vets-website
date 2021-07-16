import React from 'react';
import { expect } from 'chai';

import { mockFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getClinicMock,
  getVAFacilityMock,
  getRequestEligibilityCriteriaMock,
  getDirectBookingEligibilityCriteriaMock,
} from '../../../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
} from '../../../mocks/helpers';

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};

const parentSite984 = {
  id: '984',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '984',
    authoritativeName: 'Some VA facility 2',
    rootStationCode: '984',
    parentStationCode: '984',
  },
};

describe('VAOS <VAFacilityPageV2> eligibility check', () => {
  describe('when there is a single supported facility', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingDirect: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
        },
      },
    };

    beforeEach(() => {
      mockFetch();
      const siteIds = ['983'];

      mockParentSites(siteIds, [parentSite983]);
      mockDirectBookingEligibilityCriteria(siteIds, [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
        }),
      ]);
      mockRequestEligibilityCriteria(siteIds, [
        getRequestEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
        }),
      ]);
      mockFacilitiesFetch('vha_442', [
        {
          id: 'vha_442',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '442',
            name: 'San Diego VA Medical Center',
            address: {
              physical: {
                address1: '2360 East Pershing Boulevard',
                city: 'San Diego',
                state: 'CA',
                zip: '92128',
              },
            },
            phone: {
              main: '858-779-0338',
            },
          },
        },
      ]);
    });

    it('should show no clinics message when direct is supported, no clinics available, requests not supported', async () => {
      mockRequestEligibilityCriteria(['983'], []);
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
        clinics: [
          {
            id: '308',
            attributes: {
              ...getClinicMock(),
              siteCode: '983',
              clinicId: '308',
              institutionCode: '983',
              clinicFriendlyLocationName: 'Green team clinic',
            },
          },
        ],
        pastClinics: false,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(
        /doesn’t have any available clinics that support online scheduling/i,
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      const siteIds = ['983'];
      mockParentSites(siteIds, [parentSite983]);
      mockDirectBookingEligibilityCriteria(siteIds, []);
      mockRequestEligibilityCriteria(siteIds, [
        getRequestEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '502',
        }),
      ]);

      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/San Diego VA Medical Center/i);
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /you need to have had a mental health appointment at this facility within the last 12 months/,
      );
    });

    it('should show request limits message when not eligible for direct, requests are supported, over request limit', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
        requestPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/San Diego VA Medical Center/i);

      expect(screen.baseElement).to.contain.text(
        'You can’t request another appointment until you schedule or cancel your open requests',
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show error message when checks fail', async () => {
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/Something went wrong on our end/)).to
        .exist;

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });
  });

  describe('when there are multiple facilities to choose from', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingDirect: true,
      },
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '984', isCerner: false },
          ],
        },
      },
    };
    const parentSiteIds = ['983', '984'];

    const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];
    const typeOfCareId = '323';
    const vhaIds = facilityIds.map(
      id => `vha_${id.replace('983', '442').replace('984', '552')}`,
    );
    const facilities = vhaIds.map((id, index) => ({
      id,
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: id.replace('vha_', ''),
        name: `Fake facility name ${index + 1}`,
        lat: Math.random() * 90,
        long: Math.random() * 180,
        address: {
          physical: {
            ...getVAFacilityMock().attributes.address.physical,
            city: `Fake city ${index + 1}`,
          },
        },
      },
    }));

    const requestFacilities = facilityIds.map(id =>
      getRequestEligibilityCriteriaMock({
        id,
        typeOfCareId,
      }),
    );

    const directFacilities = facilityIds.map(id =>
      getDirectBookingEligibilityCriteriaMock({
        id,
        typeOfCareId,
      }),
    );

    beforeEach(() => mockFetch());
    it('should show past visits message when direct is supported, no past visits, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, [
        parentSiteIds,
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '502',
          patientHistoryRequired: 'Yes',
          patientHistoryDuration: 365,
        }),
        getDirectBookingEligibilityCriteriaMock({
          id: '984',
          typeOfCareId: '502',
          patientHistoryRequired: 'Yes',
          patientHistoryDuration: 365,
        }),
      ]);
      mockRequestEligibilityCriteria(parentSiteIds, []);
      mockFacilitiesFetch(
        'vha_442,vha_552',
        facilities.filter(f => f.id === 'vha_442' || f.id === 'vha_552'),
      );
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/below is a list of VA locations/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /We couldn’t find a recent appointment at this location/i,
      );
      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should show no clinics message when direct is supported, no available clinics, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.slice(0, 5),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.slice(0, 4),
      );
      mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983QA',
        typeOfCareId: '323',
        directPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/below is a list of VA locations/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /We couldn’t find a clinic for this type of care/,
      );
      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should show eligibility modal again when user closes it out and hits continue with the same facility', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.slice(0, 5),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.slice(0, 4),
      );
      mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983QA',
        typeOfCareId: '323',
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/below is a list of VA locations/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /We couldn’t find a clinic for this type of care/i,
      );
      const closeButton = screen.container.querySelector('.va-modal-close');
      fireEvent.click(closeButton);
      expect(screen.baseElement).not.to.contain.text(
        /We couldn’t find a clinic for this type of care/i,
      );
      fireEvent.click(await screen.findByText(/Continue/));
      await screen.findByText(
        /We couldn’t find a clinic for this type of care/i,
      );
    });

    it('should show error message when eligibility calls fail', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetch(vhaIds.join(','), facilities);
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 2/i));
      fireEvent.click(screen.getByText(/Continue/));
      expect(await screen.findByText(/something went wrong on our end/i)).to
        .exist;
    });

    it('should show request limit message when not eligible for direct, requests are supported, over request limit', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetch(vhaIds.join(','), facilities);
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /You’ve reached the limit for appointment requests/i,
      );
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.map(f => ({
          ...f,
          attributes: {
            ...f.attributes,
            coreSettings: [
              {
                ...f.attributes.coreSettings[0],
                id: '502',
                typeOfCare: 'Outpatient Mental Health',
              },
            ],
          },
        })),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.map(f => ({
          ...f,
          attributes: {
            ...f.attributes,
            requestSettings: [
              {
                ...f.attributes.requestSettings[0],
                id: '502',
                typeOfCare: 'Outpatient Mental Health',
              },
            ],
          },
        })),
      );
      mockFacilitiesFetch(vhaIds.join(','), facilities);
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(/We can’t find a recent appointment for you/i);
      expect(screen.getByRole('alertdialog')).to.be.ok;
      fireEvent.click(screen.getByRole('button', { name: 'Close this modal' }));

      await waitFor(
        () =>
          expect(
            screen.queryByText(/We can’t find a recent appointment for you/i),
          ).to.not.exist,
      );
    });

    it('should continue to requests if direct is supported but disabled by feature toggle', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.map(f => ({
          ...f,
          attributes: {
            ...f.attributes,
            coreSettings: [
              {
                ...f.attributes.coreSettings[0],
                id: '502',
                typeOfCare: 'Outpatient Mental Health',
              },
            ],
          },
        })),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.map(f => ({
          ...f,
          attributes: {
            ...f.attributes,
            requestSettings: [
              {
                ...f.attributes.requestSettings[0],
                id: '502',
                typeOfCare: 'Outpatient Mental Health',
              },
            ],
          },
        })),
      );
      mockFacilitiesFetch(vhaIds.join(','), facilities);
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
        requestPastVisits: true,
        directPastVisits: true,
      });
      const store = createTestStore({
        ...initialState,
        featureToggles: {},
      });
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));

      await waitFor(() =>
        expect(screen.history.push.firstCall.args[0]).to.equal(
          '/new-appointment/request-date',
        ),
      );
    });
  });
});
