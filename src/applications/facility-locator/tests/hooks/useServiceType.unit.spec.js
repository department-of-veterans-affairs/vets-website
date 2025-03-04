import { expect } from 'chai';
import { filterMatches } from '../../hooks/useServiceType';
import vaHealthcareServices from './test-va-healthcare-services.json';

describe('filterMatches (VAMC)', () => {
  describe('when matches are expected', () => {
    const getServiceNamesOnly = filteredServices =>
      filteredServices.map(service => service[0]);

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'mental', 'vamc');
      const expected = [
        'Mental health care',
        'Women Veteran care',
        'Women centered care',
        'Returning service member care',
        'Psychiatry',
        'Psychology',
        'Plastic and reconstructive surgery',
        'Complementary and integrative health',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'cancer', 'vamc');
      const expected = [
        'Urology',
        'Gastroenterology',
        'Dermatology',
        'Cancer care',
        'Thoracic surgery',
        'Surgical oncology',
        'Hematology/oncology',
        'Radiation oncology',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(
        vaHealthcareServices,
        'quit smoking',
        'vamc',
      );
      const expected = ['Smoking and tobacco cessation'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'disability', 'vamc');
      const expected = [
        'Physical medicine and rehabilitation',
        'Adaptive sports',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'heart', 'vamc');
      const expected = [
        'Cardiology',
        'Cardiovascular surgery',
        'Transplant surgery',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'diabetes', 'vamc');
      const expected = [
        'MOVE! weight management',
        'Diabetes care',
        'Endocrinology',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });
  });

  describe('when no matches are expected', () => {
    it('should not return matches when they are not offered by VAMCs', () => {
      const results = filterMatches(vaHealthcareServices, 'burial', 'vamc');
      expect(results.length).to.equal(0);
    });

    it('should not return matches when a term is not found', () => {
      const results = filterMatches(vaHealthcareServices, 'gymnastics', 'vamc');
      expect(results.length).to.equal(0);
    });

    it('should not return matches when a term is not found', () => {
      const results = filterMatches(vaHealthcareServices, 'typo\\', 'vamc');
      expect(results.length).to.equal(0);
    });
  });
});
