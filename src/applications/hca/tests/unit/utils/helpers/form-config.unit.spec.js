import { expect } from 'chai';

import {
  isLoggedOut,
  hasLowDisabilityRating,
  hasHighCompensation,
  hasNoCompensation,
  notShortFormEligible,
  dischargePapersRequired,
  isMissingVeteranDob,
  isSigiEnabled,
  hasDifferentHomeAddress,
  teraInformationEnabled,
  includeTeraInformation,
  includeGulfWarServiceDates,
  includeOtherExposureDates,
  includeOtherExposureDetails,
  showFinancialConfirmation,
  includeHouseholdInformation,
  includeSpousalInformation,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  collectMedicareInformation,
  useLighthouseFacilityList,
  useJsonFacilityList,
} from '../../../../utils/helpers/form-config';
import {
  DEPENDENT_VIEW_FIELDS,
  HIGH_DISABILITY_MINIMUM,
} from '../../../../utils/constants';

describe('hca form config helpers', () => {
  context('when `isLoggedOut` executes', () => {
    const getData = ({ loggedIn = true }) => ({
      'view:isLoggedIn': loggedIn,
    });

    it('should return `false` when user is authenticated', () => {
      const formData = getData({});
      expect(isLoggedOut(formData)).to.be.false;
    });

    it('should return `true` when user is unauthenticated', () => {
      const formData = getData({ loggedIn: false });
      expect(isLoggedOut(formData)).to.be.true;
    });
  });

  context('when `hasLowDisabilityRating` executes', () => {
    const getData = ({ rating = 0 }) => ({
      'view:totalDisabilityRating': rating,
    });

    it('should return `false` when rating is greater than or equal to the minimum', () => {
      const formData = getData({ rating: 80 });
      expect(hasLowDisabilityRating(formData)).to.be.false;
    });

    it('should return `true` when rating is less than to the minimum', () => {
      const formData = getData({});
      expect(hasLowDisabilityRating(formData)).to.be.true;
    });
  });

  context('when `hasHighCompensation` executes', () => {
    const getData = ({ type = 'none' }) => ({
      vaCompensationType: type,
    });

    it('should return `false` when compensation type is not `highDisability`', () => {
      const formData = getData({});
      expect(hasHighCompensation(formData)).to.be.false;
    });

    it('should return `true` when compensation type is `highDisability`', () => {
      const formData = getData({ type: 'highDisability' });
      expect(hasHighCompensation(formData)).to.be.true;
    });
  });

  context('when `hasNoCompensation` executes', () => {
    const getData = ({ type = 'highDisability' }) => ({
      vaCompensationType: type,
    });

    it('should return `false` when compensation type is not `none`', () => {
      const formData = getData({});
      expect(hasNoCompensation(formData)).to.be.false;
    });

    it('should return `true` when compensation type is `none`', () => {
      const formData = getData({ type: 'none' });
      expect(hasNoCompensation(formData)).to.be.true;
    });
  });

  context('when `notShortFormEligible` executes ', () => {
    const getData = ({ compensation = 'none', rating = 0 }) => ({
      vaCompensationType: compensation,
      'view:totalDisabilityRating': rating,
    });

    context('when disability rating is less than the minimum', () => {
      it('should return `true` when compensation type is not `highDisability`', () => {
        const formData = getData({});
        expect(notShortFormEligible(formData)).to.be.true;
      });

      it('should return `false` when compensation type is `highDisability`', () => {
        const formData = getData({ compensation: 'highDisability' });
        expect(notShortFormEligible(formData)).to.be.false;
      });
    });

    context('when disability rating is greater or equal to the minimum', () => {
      it('should return `false`', () => {
        const formData = getData({ rating: HIGH_DISABILITY_MINIMUM });
        expect(notShortFormEligible(formData)).to.be.false;
      });
    });
  });

  context('when `dischargePapersRequired` executes', () => {
    const getData = ({ inMvi = true, disabilityRating = 0 }) => ({
      'view:totalDisabilityRating': disabilityRating,
      'view:isUserInMvi': inMvi,
    });

    it('should return `false` when user is found in MVI/MPI', () => {
      const formData = getData({});
      expect(dischargePapersRequired(formData)).to.be.false;
    });

    it('should return `true` when user is NOT found in MVI/MPI', () => {
      const formData = getData({ inMvi: false });
      expect(dischargePapersRequired(formData)).to.be.true;
    });

    it('should return `false` when user is short form eligible', () => {
      const formData = getData({ disabilityRating: 80 });
      expect(dischargePapersRequired(formData)).to.be.false;
    });
  });

  context('when `isMissingVeteranDob` executes', () => {
    it('should return `true` when viewfield is `null`', () => {
      const formData = { 'view:isLoggedIn': true, 'view:userDob': null };
      expect(isMissingVeteranDob(formData)).to.be.true;
    });

    it('should return `false` when viewfield is populated', () => {
      const formData = {
        'view:isLoggedIn': true,
        'view:userDob': '1990-01-01',
      };
      expect(isMissingVeteranDob(formData)).to.be.false;
    });
  });

  context('when `isSigiEnabled` executes', () => {
    it('should return `true` when value is `true`', () => {
      const formData = { 'view:isSigiEnabled': true };
      expect(isSigiEnabled(formData)).to.be.true;
    });

    it('should return `false` when value is `false`', () => {
      const formData = { 'view:isSigiEnabled': false };
      expect(isSigiEnabled(formData)).to.be.false;
    });
  });

  context('when `hasDifferentHomeAddress` executes', () => {
    it('should return `false` when mailing matches home address', () => {
      const formData = { 'view:doesMailingMatchHomeAddress': true };
      expect(hasDifferentHomeAddress(formData)).to.be.false;
    });

    it('should return `true` when mailing does not match home address', () => {
      const formData = { 'view:doesMailingMatchHomeAddress': false };
      expect(hasDifferentHomeAddress(formData)).to.be.true;
    });
  });

  context('when `teraInformationEnabled` executes', () => {
    const getData = ({ enabled = false, disabilityRating = 0 }) => ({
      'view:totalDisabilityRating': disabilityRating,
      'view:isTeraEnabled': enabled,
    });

    it('should return `false` when feature flag is disabled', () => {
      const formData = getData({});
      expect(teraInformationEnabled(formData)).to.be.false;
    });

    it('should return `true` when feature flag is enabled', () => {
      const formData = getData({ enabled: true });
      expect(teraInformationEnabled(formData)).to.be.true;
    });

    it('should return `false` when user is short form eligible', () => {
      const formData = getData({ disabilityRating: 80 });
      expect(teraInformationEnabled(formData)).to.be.false;
    });
  });

  context('when `includeTeraInformation` executes', () => {
    const getData = ({ response = null, enabled = true }) => ({
      'view:totalDisabilityRating': 0,
      'view:isTeraEnabled': enabled,
      hasTeraResponse: response,
    });

    it('should return `true` when response is `true`', () => {
      const formData = getData({ response: true });
      expect(includeTeraInformation(formData)).to.be.true;
    });

    it('should return `false` when response is `false`', () => {
      const formData = getData({ response: false });
      expect(includeTeraInformation(formData)).to.be.false;
    });

    it('should return `false` when feature flag is disabled', () => {
      const formData = getData({ enabled: false });
      expect(includeTeraInformation(formData)).to.be.false;
    });
  });

  context('when `includeGulfWarServiceDates` executes', () => {
    const getData = ({ response = null }) => ({
      gulfWarService: response,
    });

    it('should return `true` when response is `true`', () => {
      const formData = getData({ response: true });
      expect(includeGulfWarServiceDates(formData)).to.be.true;
    });

    it('should return `false` when response is `false`', () => {
      const formData = getData({ response: false });
      expect(includeGulfWarServiceDates(formData)).to.be.false;
    });
  });

  context('when `includeOtherExposureDates` executes', () => {
    const getData = ({ exposures = {} }) => ({
      'view:otherToxicExposures': exposures,
    });

    it('should return `false` when form data does not include the data object', () => {
      expect(includeOtherExposureDates({})).to.be.false;
    });

    it('should return `false` when the form data object is empty', () => {
      const formData = getData({});
      expect(includeOtherExposureDates(formData)).to.be.false;
    });

    it('should return `false` when the form data does not contain a truthy value', () => {
      const formData = getData({ exposures: { a: false, b: false, c: false } });
      expect(includeOtherExposureDates(formData)).to.be.false;
    });

    it('should return `true` when the form data contains a truthy value', () => {
      const formData = getData({ exposures: { a: false, b: true, c: false } });
      expect(includeOtherExposureDates(formData)).to.be.true;
    });
  });

  context('when `includeOtherExposureDetails` executes', () => {
    const getData = ({ exposures = {} }) => ({
      'view:otherToxicExposures': exposures,
    });

    it('should return `false` when the `exposureToOther` key is `false`', () => {
      const formData = getData({ exposures: { exposureToOther: false } });
      expect(includeOtherExposureDetails(formData)).to.be.false;
    });

    it('should return `true` when the `exposureToOther` key is `true`', () => {
      const formData = getData({ exposures: { exposureToOther: true } });
      expect(includeOtherExposureDetails(formData)).to.be.true;
    });
  });

  context('when `showFinancialConfirmation` executes', () => {
    const getData = ({ disabilityRating = 0, discloseFinancials = true }) => ({
      'view:totalDisabilityRating': disabilityRating,
      discloseFinancialInformation: discloseFinancials,
    });

    context('when financial disclosure is `true`', () => {
      it('should return `false`', () => {
        const formData = getData({});
        expect(showFinancialConfirmation(formData)).to.be.false;
      });
    });

    context('when financial disclosure is `false`', () => {
      it('should return `true`', () => {
        const formData = getData({ discloseFinancials: false });
        expect(showFinancialConfirmation(formData)).to.be.true;
      });
    });

    context('when user is short form eligible', () => {
      it('should return `false`', () => {
        const formData = getData({ disabilityRating: 80 });
        expect(showFinancialConfirmation(formData)).to.be.false;
      });
    });
  });

  context('when `includeHouseholdInformation` executes', () => {
    const getData = ({ disabilityRating = 0, discloseFinancials = true }) => ({
      'view:totalDisabilityRating': disabilityRating,
      discloseFinancialInformation: discloseFinancials,
    });

    context('when financial disclosure is `true`', () => {
      it('should return `true`', () => {
        const formData = getData({});
        expect(includeHouseholdInformation(formData)).to.be.true;
      });
    });

    context('when financial disclosure is `false`', () => {
      it('should return `false`', () => {
        const formData = getData({ discloseFinancials: false });
        expect(includeHouseholdInformation(formData)).to.be.false;
      });
    });

    context('when user is short form eligible', () => {
      it('should return `false`', () => {
        const formData = getData({ disabilityRating: 80 });
        expect(includeHouseholdInformation(formData)).to.be.false;
      });
    });
  });

  context('when `includeSpousalInformation` executes', () => {
    const getData = ({
      disabilityRating = 0,
      discloseFinancials = true,
      maritalStatus = 'never married',
    }) => ({
      'view:totalDisabilityRating': disabilityRating,
      discloseFinancialInformation: discloseFinancials,
      maritalStatus,
    });

    context('when financial disclosure is `true`', () => {
      it('should return `false` when marital status is `never married`', () => {
        const formData = getData({});
        expect(includeSpousalInformation(formData)).to.be.false;
      });

      it('should return `true` when marital status is `married`', () => {
        const formData = getData({ maritalStatus: 'married' });
        expect(includeSpousalInformation(formData)).to.be.true;
      });

      it('should return `true` when marital status is `separated`', () => {
        const formData = getData({ maritalStatus: 'separated' });
        expect(includeSpousalInformation(formData)).to.be.true;
      });
    });

    context('when financial disclosure is `false`', () => {
      it('should return `false`', () => {
        const formData = getData({ discloseFinancials: false });
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    context('when user is short form eligible', () => {
      it('should return `false`', () => {
        const formData = getData({ disabilityRating: 80 });
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });
  });

  context('when `spouseDidNotCohabitateWithVeteran` executes', () => {
    const getData = ({ status = 'married', cohabitated = null }) => ({
      formData: {
        'view:totalDisabilityRating': 0,
        discloseFinancialInformation: true,
        cohabitedLastYear: cohabitated,
        maritalStatus: status,
      },
    });

    it('should return `false` when Veteran was not married or legally separarted', () => {
      const { formData } = getData({ status: 'not married' });
      expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.false;
    });

    it('should return `false` when spouse did cohabitate with Veteran', () => {
      const { formData } = getData({ cohabitated: true });
      expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.false;
    });

    it('should return `true` when spouse did not cohabitate with Veteran', () => {
      const { formData } = getData({ cohabitated: false });
      expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.true;
    });
  });

  context('when `spouseAddressDoesNotMatchVeterans` executes', () => {
    const getData = ({ status = 'married', sameAddress = null }) => ({
      formData: {
        'view:totalDisabilityRating': 0,
        discloseFinancialInformation: true,
        maritalStatus: status,
        sameAddress,
      },
    });

    it('should return `false` when Veteran was not married or legally separarted', () => {
      const { formData } = getData({ status: 'not married' });
      expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.false;
    });

    it('should return `false` when spouse address matches Veteran', () => {
      const { formData } = getData({ sameAddress: true });
      expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.false;
    });

    it('should return `true` when spouse address does not match Veteran', () => {
      const { formData } = getData({ sameAddress: false });
      expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.true;
    });
  });

  context('when `includeDependentInformation` executes', () => {
    const getData = ({ skip }) => ({
      formData: {
        'view:totalDisabilityRating': 0,
        discloseFinancialInformation: true,
        [DEPENDENT_VIEW_FIELDS.skip]: skip,
      },
    });

    it('should return `false` when skip value is `true`', () => {
      const { formData } = getData({ skip: true });
      expect(includeDependentInformation(formData)).to.be.false;
    });

    it('should return `true` when skip value is `false`', () => {
      const { formData } = getData({ skip: false });
      expect(includeDependentInformation(formData)).to.be.true;
    });
  });

  context('when `collectMedicareInformation` executes', () => {
    const getData = ({ enrolled = null }) => ({
      formData: {
        'view:totalDisabilityRating': 0,
        isEnrolledMedicarePartA: enrolled,
      },
    });

    it('should return `true` when Veteran is enrolled in Medicare', () => {
      const { formData } = getData({ enrolled: true });
      expect(collectMedicareInformation(formData)).to.be.true;
    });

    it('should return `false` when Veteran is not enrolled in Medicare', () => {
      const { formData } = getData({ enrolled: false });
      expect(collectMedicareInformation(formData)).to.be.false;
    });
  });

  context('when `useLighthouseFacilityList` executes', () => {
    it('should return `true` when viewfield is set to `true`', () => {
      const formData = { 'view:isFacilitiesApiEnabled': true };
      expect(useLighthouseFacilityList(formData)).to.be.true;
    });

    it('should return `false` when viewfield is set to `false`', () => {
      const formData = { 'view:isFacilitiesApiEnabled': false };
      expect(useLighthouseFacilityList(formData)).to.be.false;
    });
  });

  context('when `useJsonFacilityList` executes', () => {
    it('should return `false` when viewfield is set to `true`', () => {
      const formData = { 'view:isFacilitiesApiEnabled': true };
      expect(useJsonFacilityList(formData)).to.be.false;
    });

    it('should return `true` when viewfield is set to `false`', () => {
      const formData = { 'view:isFacilitiesApiEnabled': false };
      expect(useJsonFacilityList(formData)).to.be.true;
    });
  });
});
