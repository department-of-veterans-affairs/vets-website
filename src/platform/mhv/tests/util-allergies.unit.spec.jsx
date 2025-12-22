import { expect } from 'chai';
import {
  convertAllergy,
  convertUnifiedAllergy,
  getReactions,
} from '../util/allergies';
import { allergyTypes } from '../util/constants';

const DEFAULT_EMPTY_FIELD = 'None recorded';

describe('Shared Allergy Utilities', () => {
  describe('getReactions', () => {
    it('should extract reactions from a FHIR allergy record', () => {
      const record = {
        reaction: [
          {
            manifestation: [{ text: 'Hives' }, { text: 'Swelling' }],
          },
        ],
      };

      const result = getReactions(record);

      expect(result).to.deep.equal(['Hives', 'Swelling']);
    });

    it('should handle multiple reaction entries', () => {
      const record = {
        reaction: [
          {
            manifestation: [{ text: 'Hives' }],
          },
          {
            manifestation: [{ text: 'Difficulty breathing' }],
          },
        ],
      };

      const result = getReactions(record);

      expect(result).to.deep.equal(['Hives', 'Difficulty breathing']);
    });

    it('should return empty array when record is null', () => {
      const result = getReactions(null);

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when record is undefined', () => {
      const result = getReactions(undefined);

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when record has no reaction property', () => {
      const record = { id: '123' };

      const result = getReactions(record);

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when reaction array is empty', () => {
      const record = { reaction: [] };

      const result = getReactions(record);

      expect(result).to.deep.equal([]);
    });

    it('should handle reaction with empty manifestation array', () => {
      const record = {
        reaction: [{ manifestation: [] }],
      };

      const result = getReactions(record);

      expect(result).to.deep.equal([]);
    });

    it('should handle reaction with undefined manifestation', () => {
      const record = {
        reaction: [{ severity: 'mild' }], // manifestation is undefined
      };

      const result = getReactions(record);

      expect(result).to.deep.equal([]);
    });

    it('should handle reaction with non-array manifestation', () => {
      const record = {
        reaction: [{ manifestation: 'not an array' }],
      };

      const result = getReactions(record);

      expect(result).to.deep.equal([]);
    });

    it('should handle mixed reactions with valid and invalid manifestations', () => {
      const record = {
        reaction: [
          { manifestation: [{ text: 'Hives' }] },
          { severity: 'mild' }, // no manifestation
          { manifestation: 'invalid' }, // non-array manifestation
          { manifestation: [{ text: 'Swelling' }] },
        ],
      };

      const result = getReactions(record);

      expect(result).to.deep.equal(['Hives', 'Swelling']);
    });
  });

  describe('convertAllergy', () => {
    it('should convert a complete FHIR allergy correctly with default options', () => {
      const fhirAllergy = {
        id: '12345',
        category: ['medication', 'food'],
        code: { text: 'Penicillin' },
        recordedDate: '2024-01-15T10:30:00Z',
        reaction: [
          {
            manifestation: [{ text: 'Hives' }, { text: 'Swelling' }],
          },
        ],
        recorder: {
          display: 'Dr. Smith',
          extension: [
            {
              valueReference: {
                reference: '#org1',
              },
            },
          ],
        },
        contained: [
          {
            id: 'org1',
            name: 'VA Medical Center',
          },
        ],
        extension: [{ url: 'allergyObservedHistoric', valueCode: 'o' }],
        note: [{ text: 'Patient reported mild reaction' }],
      };

      const result = convertAllergy(fhirAllergy);

      expect(result.id).to.equal('12345');
      expect(result.type).to.equal('Medication, food');
      expect(result.name).to.equal('Penicillin');
      expect(result.date).to.equal('January 15, 2024');
      expect(result.reaction).to.deep.equal(['Hives', 'Swelling']);
      expect(result.location).to.equal('VA Medical Center');
      expect(result.observedOrReported).to.equal(allergyTypes.OBSERVED);
      expect(result.notes).to.equal('Patient reported mild reaction');
      expect(result.provider).to.equal('Dr. Smith');
    });

    it('should handle missing data gracefully with default empty field', () => {
      const fhirAllergy = {
        id: '12345',
      };

      const result = convertAllergy(fhirAllergy);

      expect(result.id).to.equal('12345');
      expect(result.type).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.name).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.date).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.reaction).to.deep.equal([]);
      expect(result.location).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.observedOrReported).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.notes).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.provider).to.equal(DEFAULT_EMPTY_FIELD);
    });

    it('should use custom empty field values when provided', () => {
      const fhirAllergy = {
        id: '12345',
      };

      const result = convertAllergy(fhirAllergy, {
        emptyField: 'Not available',
        noneNotedField: 'None noted',
      });

      expect(result.type).to.equal('Not available');
      expect(result.name).to.equal('None noted');
      expect(result.date).to.equal('Not available');
      expect(result.location).to.equal('Not available');
      expect(result.notes).to.equal('None noted');
    });

    it('should exclude provider when includeProvider is false', () => {
      const fhirAllergy = {
        id: '12345',
        recorder: { display: 'Dr. Smith' },
      };

      const result = convertAllergy(fhirAllergy, {
        includeProvider: false,
      });

      expect(result.provider).to.be.undefined;
    });

    it('should use only first category when joinAllCategories is false', () => {
      const fhirAllergy = {
        id: '12345',
        category: ['medication', 'food'],
      };

      const result = convertAllergy(fhirAllergy, {
        joinAllCategories: false,
      });

      expect(result.type).to.equal('Medication');
    });

    it('should return REPORTED for historical allergies', () => {
      const fhirAllergy = {
        id: '12345',
        extension: [{ url: 'allergyObservedHistoric', valueCode: 'h' }],
      };

      const result = convertAllergy(fhirAllergy);

      expect(result.observedOrReported).to.equal(allergyTypes.REPORTED);
    });

    it('should handle Medications app options correctly', () => {
      const fhirAllergy = {
        id: '12345',
        category: ['medication', 'food'],
        code: { text: 'Aspirin' },
        recorder: { display: 'Dr. Jones' },
      };

      // Simulate Medications app options
      const result = convertAllergy(fhirAllergy, {
        emptyField: 'Not available',
        noneNotedField: 'None noted',
        includeProvider: false,
        joinAllCategories: false,
      });

      expect(result.type).to.equal('Medication'); // Only first category
      expect(result.provider).to.be.undefined; // No provider field
    });
  });

  describe('convertUnifiedAllergy', () => {
    it('should convert unified allergy data correctly', () => {
      const unifiedAllergy = {
        id: '123',
        type: 'allergy',
        attributes: {
          id: '123',
          name: 'Test Allergy',
          categories: ['medication', 'food'],
          date: '2024-01-01T12:00:00.000+00:00',
          reactions: ['Hives', 'Swelling'],
          location: 'VA Medical Center',
          observedHistoric: null,
          notes: ['Test notes'],
          provider: 'Dr. Test',
        },
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.id).to.equal('123');
      expect(result.name).to.equal('Test Allergy');
      expect(result.type).to.equal('Medication, food');
      expect(result.reaction).to.deep.equal(['Hives', 'Swelling']);
      expect(result.location).to.equal('VA Medical Center');
      expect(result.observedOrReported).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.notes).to.equal('Test notes');
      expect(result.provider).to.equal('Dr. Test');
      expect(result.date).to.equal('January 1, 2024');
      expect(result.sortKey).to.be.instanceOf(Date);
      expect(result.isOracleHealthData).to.be.true;
    });

    it('should handle missing data gracefully', () => {
      const unifiedAllergy = {
        id: '123',
        type: 'allergy',
        attributes: {},
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.id).to.equal('123');
      expect(result.name).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.type).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.reaction).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.location).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.observedOrReported).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.notes).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.provider).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.date).to.equal(DEFAULT_EMPTY_FIELD);
      expect(result.sortKey).to.be.null;
    });

    it('should handle observedHistoric value of "o" as OBSERVED', () => {
      const unifiedAllergy = {
        id: '123',
        attributes: {
          observedHistoric: 'o',
        },
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.observedOrReported).to.equal(allergyTypes.OBSERVED);
    });

    it('should handle observedHistoric value of "h" as REPORTED', () => {
      const unifiedAllergy = {
        id: '123',
        attributes: {
          observedHistoric: 'h',
        },
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.observedOrReported).to.equal(allergyTypes.REPORTED);
    });

    it('should use custom empty field when provided', () => {
      const unifiedAllergy = {
        id: '123',
        attributes: {},
      };

      const result = convertUnifiedAllergy(unifiedAllergy, {
        emptyField: 'Not available',
      });

      expect(result.name).to.equal('Not available');
      expect(result.type).to.equal('Not available');
    });

    it('should handle allergy without attributes wrapper', () => {
      const unifiedAllergy = {
        id: '123',
        name: 'Direct Allergy',
        categories: ['food'],
        date: '2024-06-15T00:00:00.000Z',
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.id).to.equal('123');
      expect(result.name).to.equal('Direct Allergy');
      expect(result.type).to.equal('Food');
    });

    it('should join multiple notes with space', () => {
      const unifiedAllergy = {
        id: '123',
        attributes: {
          notes: ['First note.', 'Second note.', 'Third note.'],
        },
      };

      const result = convertUnifiedAllergy(unifiedAllergy);

      expect(result.notes).to.equal('First note. Second note. Third note.');
    });
  });
});
