import { expect } from 'chai';
import { filterMatches } from '../../hooks/useServiceType';
import vaHealthcareServices from './test-va-healthcare-services.json';

describe('filterMatches (VAMC)', () => {
  describe('when matches are expected', () => {
    const getServiceNamesOnly = filteredServices =>
      filteredServices.map(service => service[0]);

    it.only('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'operation', 'vamc');
      const expected = ['Operational medicine'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'corrective', 'vamc');
      const expected = ['Optometry'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'prostate', 'vamc');
      const expected = ['Urology'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'marrow', 'vamc');
      const expected = ['Transplant surgery'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'TRICARE', 'vamc');
      const expected = [
        'Case management',
        'COVID-19 vaccines',
        'Laboratory and pathology',
        'Pharmacy',
        'Telehealth',
        'Travel reimbursement',
      ];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'mammogram', 'vamc');
      const expected = ['Women centered care', 'Women Veteran care'];

      expect(getServiceNamesOnly(results)).to.eql(expected);
    });

    it('should return the correct match for a search term', () => {
      const results = filterMatches(vaHealthcareServices, 'men', 'vamc');
      const expected = [
        'Mental health care',
        'Complementary and integrative health',
        'Psychiatry',
        'Psychology',
        'Returning service member care',
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
