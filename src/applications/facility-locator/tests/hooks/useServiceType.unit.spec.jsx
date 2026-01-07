import { expect } from 'chai';
import {
  FACILITY_TYPE_FILTERS,
  filterServicesByFacilityType,
  filterMatches,
} from '../../hooks/useServiceType';
import vaHealthcareServices from './test-va-healthcare-services.json';

const vamcServices = vaHealthcareServices.data.filter(service => service[7]);

describe('useServiceType hook for services autosuggest', () => {
  describe('filterServicesByFacilityType', () => {
    it('should correctly filter data by facility type for vet center', () => {
      const vetCenterServices = filterServicesByFacilityType(
        vaHealthcareServices.data,
        FACILITY_TYPE_FILTERS.VET_CENTER,
      );

      expect(vetCenterServices[0][5]).to.be.true;
    });

    it('should correctly filter data by facility type for VBA', () => {
      const vbaServices = filterServicesByFacilityType(
        vaHealthcareServices.data,
        FACILITY_TYPE_FILTERS.VBA,
      );

      expect(vbaServices[0][6]).to.be.true;
    });

    it('should correctly filter data by facility type for vamc', () => {
      const vaHealthServices = filterServicesByFacilityType(
        vaHealthcareServices.data,
        FACILITY_TYPE_FILTERS.VAMC,
      );

      expect(vaHealthServices[0][7]).to.be.true;
    });

    it('should correctly filter data by facility type for TRICARE', () => {
      const tricareServices = filterServicesByFacilityType(
        vaHealthcareServices.data,
        FACILITY_TYPE_FILTERS.TRICARE,
      );

      expect(tricareServices[0][8]).to.be.true;
    });
  });

  describe('filterMatches (VAMC)', () => {
    describe('when matches are expected', () => {
      const getServiceNamesOnly = filteredServices =>
        filteredServices.map(service => service[0]);

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'operation',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Operational medicine'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'corrective',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Optometry'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'prostate',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Urology'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'marrow',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Transplant surgery'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'TRICARE',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = [
          'Case management',
          'Laboratory and pathology',
          'Pharmacy',
          'Telehealth',
          'Travel reimbursement',
        ];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'mammogram',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Women centered care', 'Women Veteran care'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'men',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = [
          'Mental health care',
          'Complementary and integrative health',
          'Psychiatry',
          'Psychology',
          'Returning service member care',
          'Women centered care',
          'Women Veteran care',
        ];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'gl',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = [
          'Blind and low vision rehabilitation',
          'Endocrinology',
          'Ophthalmology',
          'Optometry',
        ];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'noise',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Audiology'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'prescription eye',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Optometry'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'medical care',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Rehabilitation and extended care'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'GI',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Gastroenterology', 'Surgical oncology'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'women centered',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = ['Women centered care'];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'trauma',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = [
          'Military sexual trauma care',
          'Polytrauma and traumatic brain injury',
          'Mental health care',
          'Physical medicine and rehabilitation',
          'Plastic and reconstructive surgery',
          'PTSD care',
          'Women centered care',
          'Women Veteran care',
        ];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });

      it('should return the correct match for a search term', () => {
        const results = filterMatches(
          vamcServices,
          'can',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        const expected = [
          'Cancer care',
          'Surgical oncology',
          'Addiction and substance use care',
          'Allergy, asthma and immunology',
          'Caregiver support',
          'Case management',
          'Colon and rectal surgery',
          'Community engagement',
          'Complementary and integrative health',
          'Dental/oral surgery',
          'Dermatology',
          'Gastroenterology',
          'Hematology/oncology',
          'HIV/hepatitis care',
          'Homeless Veteran care',
          'Infectious disease',
          'Intimate partner violence support',
          'LGBTQ+ Veteran care',
          'Mental health care',
          'Military sexual trauma care',
          'MOVE! weight management',
          'My HealtheVet coordinator',
          'Neurosurgery',
          'Otolaryngology',
          'Pharmacy',
          'Physical therapy, occupational therapy and kinesiotherapy',
          'Plastic and reconstructive surgery',
          'Polytrauma and traumatic brain injury',
          'Psychiatry',
          'Psychology',
          'PTSD care',
          'Radiation oncology',
          'Recreation and creative arts therapy',
          'Registry exams',
          'Rehabilitation and extended care',
          'Returning service member care',
          'Smoking and tobacco cessation',
          'Suicide prevention',
          'Telehealth',
          'Thoracic surgery',
          'Travel reimbursement',
          'Urology',
          'Veteran Readiness and Employment programs',
          'Virtual Health Resource Center (VHRC)',
          'Wheelchair and mobility',
          'Wound care and ostomy',
        ];

        expect(getServiceNamesOnly(results)).to.eql(expected);
      });
    });

    describe('when no matches are expected', () => {
      it('should not return matches when they are not offered by VAMCs', () => {
        const results = filterMatches(
          vamcServices,
          'burial',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        expect(results.length).to.equal(0);
      });

      it('should not return matches when a term is not found', () => {
        const results = filterMatches(
          vamcServices,
          'gymnastics',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        expect(results.length).to.equal(0);
      });

      it('should not return matches when a term is not found', () => {
        const results = filterMatches(
          vamcServices,
          'typo\\',
          FACILITY_TYPE_FILTERS.VAMC,
        );

        expect(results.length).to.equal(0);
      });
    });
  });
});
