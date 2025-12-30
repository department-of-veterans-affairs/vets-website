import { expect } from 'chai';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
  generateAllergyItem,
} from '../../../util/pdfHelpers/allergies';

describe('PDF Helpers for Allergies - Undefined Access Protection Tests', () => {
  describe('generateAllergyItem', () => {
    it('should not throw when reaction array is empty', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: [],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'None recorded',
      };
      expect(() => generateAllergyItem(record)).to.not.throw();
      const result = generateAllergyItem(record);
      expect(result.items).to.be.an('array');
    });

    it('should not throw when reaction[0] is undefined', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: [undefined],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'None recorded',
      };
      expect(() => generateAllergyItem(record)).to.not.throw();
      const result = generateAllergyItem(record);
      expect(result.items).to.be.an('array');
    });

    it('should handle null reaction gracefully', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: null,
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'None recorded',
      };
      expect(() => generateAllergyItem(record)).to.not.throw();
    });

    it('should correctly handle single reaction', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: ['Hives'],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'Patient reported reaction',
      };
      const result = generateAllergyItem(record);
      expect(result.items).to.be.an('array');
      const reactionItem = result.items.find(
        item => item.title && item.title.includes('Signs and symptoms'),
      );
      expect(reactionItem).to.exist;
      expect(reactionItem.value).to.equal('Hives');
      expect(reactionItem.inline).to.be.true;
    });

    it('should correctly handle multiple reactions', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: ['Hives', 'Swelling', 'Difficulty breathing'],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'Patient reported multiple reactions',
      };
      const result = generateAllergyItem(record);
      expect(result.items).to.be.an('array');
      const reactionItem = result.items.find(
        item => item.title && item.title.includes('Signs and symptoms:'),
      );
      expect(reactionItem).to.exist;
      expect(reactionItem.isRich).to.be.true;
      expect(reactionItem.inline).to.be.false;
    });

    it('should handle record with missing fields', () => {
      const record = {
        name: 'Penicillin',
      };
      expect(() => generateAllergyItem(record)).to.not.throw();
      const result = generateAllergyItem(record);
      expect(result.items).to.be.an('array');
    });

    it('should handle includeHeader flag correctly', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: ['Hives'],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'None recorded',
      };
      const resultWithHeader = generateAllergyItem(record, true);
      expect(resultWithHeader).to.have.property('header');
      expect(resultWithHeader.header).to.equal('Penicillin');

      const resultWithoutHeader = generateAllergyItem(record, false);
      expect(resultWithoutHeader).to.not.have.property('header');
    });

    it('should handle undefined includeHeader flag', () => {
      const record = {
        name: 'Penicillin',
        date: 'January 15, 2024',
        reaction: ['Hives'],
        type: 'Medication',
        provider: 'Dr. Smith',
        notes: 'None recorded',
      };
      expect(() => generateAllergyItem(record)).to.not.throw();
      const result = generateAllergyItem(record);
      expect(result).to.not.have.property('header');
    });
  });

  describe('generateAllergiesContent', () => {
    it('should handle empty records array', () => {
      const records = [];
      expect(() => generateAllergiesContent(records)).to.not.throw();
      const result = generateAllergiesContent(records);
      expect(result.results.items).to.be.an('array');
      expect(result.results.items).to.have.lengthOf(0);
    });

    it('should handle records with empty reaction arrays', () => {
      const records = [
        {
          name: 'Penicillin',
          date: 'January 15, 2024',
          reaction: [],
          type: 'Medication',
          provider: 'Dr. Smith',
          notes: 'None recorded',
        },
      ];
      expect(() => generateAllergiesContent(records)).to.not.throw();
      const result = generateAllergiesContent(records);
      expect(result.results.items).to.have.lengthOf(1);
    });

    it('should handle records with undefined reaction[0]', () => {
      const records = [
        {
          name: 'Penicillin',
          date: 'January 15, 2024',
          reaction: [undefined],
          type: 'Medication',
          provider: 'Dr. Smith',
          notes: 'None recorded',
        },
      ];
      expect(() => generateAllergiesContent(records)).to.not.throw();
      const result = generateAllergiesContent(records);
      expect(result.results.items).to.have.lengthOf(1);
    });

    it('should correctly map multiple records', () => {
      const records = [
        {
          name: 'Penicillin',
          date: 'January 15, 2024',
          reaction: ['Hives'],
          type: 'Medication',
          provider: 'Dr. Smith',
          notes: 'None recorded',
        },
        {
          name: 'Peanuts',
          date: 'January 10, 2024',
          reaction: ['Anaphylaxis', 'Swelling'],
          type: 'Food',
          provider: 'Dr. Jones',
          notes: 'Severe reaction',
        },
      ];
      const result = generateAllergiesContent(records);
      expect(result.results.items).to.have.lengthOf(2);
    });

    it('should handle null records gracefully', () => {
      const records = null;
      expect(() => generateAllergiesContent(records)).to.throw();
    });
  });

  describe('generateAllergiesIntro', () => {
    it('should handle empty records array', () => {
      const records = [];
      expect(() =>
        generateAllergiesIntro(records, 'Last updated'),
      ).to.not.throw();
      const result = generateAllergiesIntro(records, 'Last updated');
      expect(result.subtitles).to.include(
        'Showing 0 records from newest to oldest',
      );
    });

    it('should correctly show record count', () => {
      const records = [
        { name: 'Penicillin' },
        { name: 'Peanuts' },
        { name: 'Latex' },
      ];
      const result = generateAllergiesIntro(
        records,
        'Last updated: Jan 1, 2024',
      );
      expect(result.subtitles).to.include(
        'Showing 3 records from newest to oldest',
      );
      expect(result.subtitles).to.include('Last updated: Jan 1, 2024');
    });

    it('should handle null records', () => {
      const records = null;
      expect(() =>
        generateAllergiesIntro(records, 'Last updated'),
      ).to.not.throw();
    });
  });
});
