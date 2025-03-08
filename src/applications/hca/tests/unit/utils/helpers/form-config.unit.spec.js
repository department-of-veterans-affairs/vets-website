import { expect } from 'chai';
import {
  isLoggedOut,
  hasLowDisabilityRating,
  hasHighCompensation,
  hasLowCompensation,
  hasNoCompensation,
  notShortFormEligible,
  includeRegOnlyAuthQuestions,
  includeRegOnlyGuestQuestions,
  showRegOnlyAuthConfirmation,
  showRegOnlyGuestConfirmation,
  dischargePapersRequired,
  isMissingVeteranDob,
  hasDifferentHomeAddress,
  includeTeraInformation,
  includeRadiationCleanUpEfforts,
  includeGulfWarService,
  includeGulfWarServiceDates,
  includePostSept11Service,
  includePostSept11ServiceDates,
  includeAgentOrangeExposure,
  includeOtherExposureDates,
  includeOtherExposureDetails,
  showFinancialConfirmation,
  includeHouseholdInformation,
  includeSpousalInformation,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  collectMedicareInformation,
  insuranceTextOverrides,
} from '../../../../utils/helpers';
import {
  DEPENDENT_VIEW_FIELDS,
  HIGH_DISABILITY_MINIMUM,
} from '../../../../utils/constants';
import content from '../../../../locales/en/content.json';

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

  context('when `hasLowCompensation` executes', () => {
    const getData = ({ type = 'none' }) => ({
      vaCompensationType: type,
    });

    it('should return `false` when compensation type is not `lowDisability`', () => {
      const formData = getData({});
      expect(hasLowCompensation(formData)).to.be.false;
    });

    it('should return `true` when compensation type is `lowDisability`', () => {
      const formData = getData({ type: 'lowDisability' });
      expect(hasLowCompensation(formData)).to.be.true;
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
    const getData = ({
      inMvi = true,
      loggedIn = false,
      compensation = 'none',
    }) => ({
      vaCompensationType: compensation,
      'view:totalDisabilityRating': 0,
      'view:isLoggedIn': loggedIn,
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
      const formData = getData({ compensation: 'highDisability' });
      expect(dischargePapersRequired(formData)).to.be.false;
    });

    it('should return `false` when user is authenticated', () => {
      const formData = getData({ loggedIn: true });
      expect(dischargePapersRequired(formData)).to.be.false;
    });
  });

  context('when `isMissingVeteranDob` executes', () => {
    it('should return `true` when veteran information is not populated', () => {
      const formData = {
        'view:isLoggedIn': true,
      };
      expect(isMissingVeteranDob(formData)).to.be.true;
    });

    it('should return `true` when date of birth value is `null`', () => {
      const formData = {
        'view:isLoggedIn': true,
        'view:veteranInformation': { veteranDateOfBirth: null },
      };
      expect(isMissingVeteranDob(formData)).to.be.true;
    });

    it('should return `false` when date of birth value is populated', () => {
      const formData = {
        'view:isLoggedIn': true,
        'view:veteranInformation': {
          veteranDateOfBirth: '1990-01-01',
        },
      };
      expect(isMissingVeteranDob(formData)).to.be.false;
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

  context('when `includeRegOnlyAuthQuestions` executes', () => {
    const getData = ({
      enabled = true,
      loggedIn = true,
      totalRating = 30,
    }) => ({
      'view:isLoggedIn': loggedIn,
      'view:isRegOnlyEnabled': enabled,
      'view:totalDisabilityRating': totalRating,
    });

    it('should return `true` when all data values are correct', () => {
      const formData = getData({});
      expect(includeRegOnlyAuthQuestions(formData)).to.be.true;
    });

    it('should return `false` when user is logged out', () => {
      const formData = getData({ loggedIn: false });
      expect(includeRegOnlyAuthQuestions(formData)).to.be.false;
    });

    it('should return `false` when feature toggle is disabled', () => {
      const formData = getData({ enabled: false });
      expect(includeRegOnlyAuthQuestions(formData)).to.be.false;
    });

    it('should return `false` when user has no disability rating', () => {
      const formData = getData({ totalRating: 0 });
      expect(includeRegOnlyAuthQuestions(formData)).to.be.false;
    });
  });

  context('when `includeRegOnlyGuestQuestions` executes', () => {
    const getData = ({
      enabled = true,
      loggedIn = false,
      compensationType = 'lowDisability',
    }) => ({
      'view:isLoggedIn': loggedIn,
      'view:isRegOnlyEnabled': enabled,
      vaCompensationType: compensationType,
    });

    it('should return `true` when all data values are correct', () => {
      const formData = getData({});
      expect(includeRegOnlyGuestQuestions(formData)).to.be.true;
    });

    it('should return `false` when user is logged in', () => {
      const formData = getData({ loggedIn: true });
      expect(includeRegOnlyGuestQuestions(formData)).to.be.false;
    });

    it('should return `false` when feature toggle is disabled', () => {
      const formData = getData({ enabled: false });
      expect(includeRegOnlyGuestQuestions(formData)).to.be.false;
    });

    it('should return `false` when user does not have a `lowDisability` rating', () => {
      const formData = getData({ compensationType: 'none' });
      expect(includeRegOnlyGuestQuestions(formData)).to.be.false;
    });
  });

  context('when `showRegOnlyAuthConfirmation` executes', () => {
    const getData = ({
      enabled = true,
      loggedIn = true,
      totalRating = 30,
      selectedPackage = 'regOnly',
    }) => ({
      'view:isLoggedIn': loggedIn,
      'view:isRegOnlyEnabled': enabled,
      'view:vaBenefitsPackage': selectedPackage,
      'view:totalDisabilityRating': totalRating,
    });

    it('should return `true` when all data values are correct', () => {
      const formData = getData({});
      expect(showRegOnlyAuthConfirmation(formData)).to.be.true;
    });

    it('should return `false` when user is logged out', () => {
      const formData = getData({ loggedIn: false });
      expect(showRegOnlyAuthConfirmation(formData)).to.be.false;
    });

    it('should return `false` when user skips the question', () => {
      const formData = getData({ selectedPackage: '' });
      expect(showRegOnlyAuthConfirmation(formData)).to.be.false;
    });

    it('should return `false` when selects a non-`regOnly` value', () => {
      const formData = getData({ selectedPackage: 'fullPackage' });
      expect(showRegOnlyAuthConfirmation(formData)).to.be.false;
    });
  });

  context('when `showRegOnlyGuestConfirmation` executes', () => {
    const getData = ({
      enabled = true,
      loggedIn = false,
      selectedPackage = 'regOnly',
      compensationType = 'lowDisability',
    }) => ({
      'view:isLoggedIn': loggedIn,
      'view:isRegOnlyEnabled': enabled,
      'view:vaBenefitsPackage': selectedPackage,
      vaCompensationType: compensationType,
    });

    it('should return `true` when all data values are correct', () => {
      const formData = getData({});
      expect(showRegOnlyGuestConfirmation(formData)).to.be.true;
    });

    it('should return `false` when user is logged in', () => {
      const formData = getData({ loggedIn: true });
      expect(showRegOnlyGuestConfirmation(formData)).to.be.false;
    });

    it('should return `false` when user skips the question', () => {
      const formData = getData({ selectedPackage: '' });
      expect(showRegOnlyGuestConfirmation(formData)).to.be.false;
    });

    it('should return `false` when selects a non-`regOnly` value', () => {
      const formData = getData({ selectedPackage: 'fullPackage' });
      expect(showRegOnlyGuestConfirmation(formData)).to.be.false;
    });
  });

  context('when `includeTeraInformation` executes', () => {
    const getData = ({ response = null }) => ({
      'view:totalDisabilityRating': 0,
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
  });

  context('when `includeRadiationCleanUpEfforts` executes', () => {
    const getData = ({ veteranDateOfBirth = null, included = true }) => ({
      hasTeraResponse: included,
      veteranDateOfBirth,
    });

    it('should return `true` when Veteran birthdate is before `Jan 1, 1966`', () => {
      const formData = getData({ veteranDateOfBirth: '1960-01-01' });
      expect(includeRadiationCleanUpEfforts(formData)).to.be.true;
    });

    it('should return `false` when Veteran birthdate is after `Dec 31, 1965`', () => {
      const formData = getData({ veteranDateOfBirth: '1990-01-01' });
      expect(includeRadiationCleanUpEfforts(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeRadiationCleanUpEfforts(formData)).to.be.false;
    });
  });

  context('when `includeGulfWarService` executes', () => {
    const getData = ({ veteranDateOfBirth = null, included = true }) => ({
      hasTeraResponse: included,
      veteranDateOfBirth,
    });

    it('should return `true` when TERA response is `true` and feature flag is disabled', () => {
      const formData = getData({ included: true, enabled: false });
      expect(includeGulfWarService(formData)).to.be.true;
    });

    it('should return `true` when Veteran birthdate is before `Feb 29, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '1960-01-01' });
      expect(includeGulfWarService(formData)).to.be.true;
    });

    it('should return `false` when Veteran birthdate is after `Feb 28, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '1990-01-01' });
      expect(includeGulfWarService(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeGulfWarService(formData)).to.be.false;
    });
  });

  context('when `includeGulfWarServiceDates` executes', () => {
    const getData = ({
      veteranDateOfBirth = '1960-01-01',
      response = null,
      included = true,
    }) => ({
      hasTeraResponse: included,
      gulfWarService: response,
      veteranDateOfBirth,
    });

    it('should return `true` when TERA response is `true` and feature flag is disabled', () => {
      const formData = getData({ included: true, enabled: false });
      expect(includeGulfWarService(formData)).to.be.true;
    });

    it('should return `true` when response is `true`', () => {
      const formData = getData({ response: true });
      expect(includeGulfWarServiceDates(formData)).to.be.true;
    });

    it('should return `false` when response is `false`', () => {
      const formData = getData({ response: false });
      expect(includeGulfWarServiceDates(formData)).to.be.false;
    });

    it('should return `false` when Veteran birthdate is after `Feb 28, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '1990-01-01' });
      expect(includeGulfWarServiceDates(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeGulfWarServiceDates(formData)).to.be.false;
    });
  });

  context('when `includePostSept11Service` executes', () => {
    const getData = ({ veteranDateOfBirth = null, included = true }) => ({
      hasTeraResponse: included,
      veteranDateOfBirth,
    });

    it('should return `true` when Veteran birthdate is after `Feb 28, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '2005-01-01' });
      expect(includePostSept11Service(formData)).to.be.true;
    });

    it('should return `false` when Veteran birthdate is before `Feb 29, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '1960-01-01' });
      expect(includePostSept11Service(formData)).to.be.false;
    });

    it('should return `false` when feature flag is disabled', () => {
      const formData = getData({ enabled: false });
      expect(includePostSept11Service(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includePostSept11Service(formData)).to.be.false;
    });
  });

  context('when `includePostSept11ServiceDates` executes', () => {
    const getData = ({
      veteranDateOfBirth = '2005-01-01',
      response = null,
      included = true,
    }) => ({
      hasTeraResponse: included,
      gulfWarService: response,
      veteranDateOfBirth,
    });

    it('should return `true` when response is `true`', () => {
      const formData = getData({ response: true });
      expect(includePostSept11ServiceDates(formData)).to.be.true;
    });

    it('should return `false` when response is `false`', () => {
      const formData = getData({ response: false });
      expect(includePostSept11ServiceDates(formData)).to.be.false;
    });

    it('should return `false` when Veteran birthdate is before `Feb 29, 1976`', () => {
      const formData = getData({ veteranDateOfBirth: '1960-01-01' });
      expect(includePostSept11ServiceDates(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includePostSept11ServiceDates(formData)).to.be.false;
    });
  });

  context('when `includeAgentOrangeExposure` executes', () => {
    const getData = ({ veteranDateOfBirth = null, included = true }) => ({
      hasTeraResponse: included,
      veteranDateOfBirth,
    });

    it('should return `true` when Veteran birthdate is before `Aug 1, 1965`', () => {
      const formData = getData({ veteranDateOfBirth: '1960-01-01' });
      expect(includeAgentOrangeExposure(formData)).to.be.true;
    });

    it('should return `false` when Veteran birthdate is after `Jul 31, 1965`', () => {
      const formData = getData({ veteranDateOfBirth: '1990-01-01' });
      expect(includeAgentOrangeExposure(formData)).to.be.false;
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeAgentOrangeExposure(formData)).to.be.false;
    });
  });

  context('when `includeOtherExposureDates` executes', () => {
    const getData = ({ exposures = {}, included = true }) => ({
      hasTeraResponse: included,
      'view:otherToxicExposures': exposures,
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeOtherExposureDates(formData)).to.be.false;
    });

    it('should return `false` when form data does not include the data object', () => {
      const formData = { hasTeraResponse: true };
      expect(includeOtherExposureDates(formData)).to.be.false;
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
    const getData = ({ exposures = {}, included = true }) => ({
      hasTeraResponse: included,
      'view:otherToxicExposures': exposures,
    });

    it('should return `false` when TERA response is `false`', () => {
      const formData = getData({ included: false });
      expect(includeOtherExposureDetails(formData)).to.be.false;
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

  context('when `insuranceTextOverrides` executes', () => {
    const defaultOutput = {
      cancelAddTitle: content['insurance-info--array-cancel-add-title'],
      cancelEditTitle: content['insurance-info--array-cancel-edit-title'],
      cancelEditDescription:
        content['insurance-info--array-cancel-edit-description'],
      cancelEditReviewDescription:
        content['insurance-info--array-cancel-edit-review-description'],
      cancelAddYes: content['insurance-info--array-cancel-add-yes'],
      cancelEditYes: content['insurance-info--array-cancel-edit-yes'],
    };
    const executeMethod = ({ item, output }) => {
      const entries = Object.entries(insuranceTextOverrides());
      for (const [key, value] of entries) {
        expect(value(item)).to.deep.eq(output[key]);
      }
    };

    it('should return the proper values when item data is present', () => {
      const item = {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'Jane Doe',
      };
      const expectedOutput = {
        ...defaultOutput,
        getItemName: 'Cigna',
        cardDescription: 'Policyholder: Jane Doe',
      };
      executeMethod({ output: expectedOutput, item });
    });

    it('should return the proper values when item data is omitted', () => {
      const item = {};
      const expectedOutput = {
        ...defaultOutput,
        getItemName: '—',
        cardDescription: 'Policyholder: —',
      };
      executeMethod({ output: expectedOutput, item });
    });
  });
});
