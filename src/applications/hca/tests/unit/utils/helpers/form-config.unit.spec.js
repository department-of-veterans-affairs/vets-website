import { expect } from 'chai';

import {
  notShortFormEligible,
  dischargePapersRequired,
  includeSpousalInformation,
  teraInformationEnabled,
  includeTeraInformation,
  includeGulfWarServiceDates,
  includeOtherExposureDates,
  includeOtherExposureDetails,
} from '../../../../utils/helpers/form-config';
import { HIGH_DISABILITY_MINIMUM } from '../../../../utils/constants';

describe('hca form config helpers', () => {
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

    it('should return `false` when there is no form data object', () => {
      const formData = getData({ exposures: undefined });
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
});
