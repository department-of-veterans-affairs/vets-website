import { expect } from 'chai';
import {
  buildAllergyPdfItem,
  buildAllergyTxtItem,
  buildAllergiesPdfList,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from '../../../util/rxExport/rxBuilders';
import {
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_ERROR_MESSAGE,
  ALLERGIES_EMPTY_MESSAGE,
} from '../../../util/rxExport/staticContent';

describe('Rx Export Builders', () => {
  describe('buildAllergyPdfItem', () => {
    it('should build allergy PDF item', () => {
      const allergy = {
        name: 'Penicillin',
        reaction: ['Rash', 'Hives'],
        type: 'Drug',
        observedOrReported: 'Observed',
      };
      const result = buildAllergyPdfItem(allergy);
      expect(result.header).to.equal('Penicillin');
      expect(result.sections[0].items).to.have.length(3);
    });
  });

  describe('buildAllergyTxtItem', () => {
    it('should build allergy TXT item', () => {
      const allergy = {
        name: 'Penicillin',
        reaction: ['Rash'],
        type: 'Drug',
        observedOrReported: 'Observed',
      };
      const result = buildAllergyTxtItem(allergy);
      expect(result).to.include('Penicillin');
      expect(result).to.include('Signs and symptoms: Rash');
      expect(result).to.include('Type of allergy: Drug');
    });
  });

  describe('buildAllergiesPdfList', () => {
    it('should build list of allergy PDF items', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: [],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
        {
          name: 'Peanuts',
          reaction: [],
          type: 'Food',
          observedOrReported: 'Reported',
        },
      ];
      const result = buildAllergiesPdfList(allergies);
      expect(result).to.have.length(2);
    });

    it('should return empty array for null', () => {
      expect(buildAllergiesPdfList(null)).to.deep.equal([]);
    });
  });

  describe('buildAllergiesPdfSection', () => {
    it('should build section with allergies', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: [],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
      ];
      const result = buildAllergiesPdfSection(allergies);
      expect(result.header).to.equal(ALLERGIES_SECTION_HEADER);
      expect(result.list).to.have.length(1);
      expect(result.preface).to.be.an('array');
    });

    it('should handle empty allergies', () => {
      const result = buildAllergiesPdfSection([]);
      expect(result.preface).to.equal(ALLERGIES_EMPTY_MESSAGE);
      expect(result.list).to.deep.equal([]);
    });

    it('should handle null allergies (error state)', () => {
      const result = buildAllergiesPdfSection(null);
      expect(result.preface[0].value).to.equal(ALLERGIES_ERROR_MESSAGE);
    });
  });

  describe('buildAllergiesTxtSection', () => {
    it('should build TXT section with allergies', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: ['Rash'],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
      ];
      const result = buildAllergiesTxtSection(allergies);
      expect(result).to.include(ALLERGIES_SECTION_HEADER);
      expect(result).to.include('Penicillin');
    });

    it('should handle empty allergies', () => {
      const result = buildAllergiesTxtSection([]);
      expect(result).to.include(ALLERGIES_SECTION_HEADER);
      expect(result).to.include('no allergies');
    });

    it('should handle null allergies (error state)', () => {
      const result = buildAllergiesTxtSection(null);
      expect(result).to.include("couldn't access");
    });
  });
});
