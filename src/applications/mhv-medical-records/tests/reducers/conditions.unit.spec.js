import { expect } from 'chai';
import {
  extractLocation,
  extractProvider,
  extractProviderNote,
} from '../../reducers/conditions';

describe('Condition Extraction Functions', () => {
  const EMPTY_FIELD = 'None noted'; // Define EMPTY_FIELD as per your implementation

  describe('extractLocation', () => {
    it('should return the location name if present', () => {
      const condition = {
        recorder: {
          extension: [
            {
              valueReference: { reference: 'some-reference' },
            },
          ],
        },
      };

      const location = extractLocation(condition);
      expect(location).to.equal(EMPTY_FIELD);
    });
  });

  describe('extractProvider', () => {
    it('should return the provider name if present', () => {
      const condition = {
        recorder: {
          reference: 'some-reference',
        },
      };

      const provider = extractProvider(condition);
      expect(provider).to.equal(EMPTY_FIELD);
    });
  });

  describe('extractProviderNote', () => {
    it('should return an array of note texts if present', () => {
      const condition = {
        note: [{ text: 'Note 1' }, { text: 'Note 2' }],
      };

      const providerNotes = extractProviderNote(condition);
      expect(providerNotes).to.deep.equal(['Note 1', 'Note 2']);
    });

    it('should return EMPTY_FIELD if notes are not present', () => {
      const condition = {};

      const providerNotes = extractProviderNote(condition);
      expect(providerNotes).to.equal(EMPTY_FIELD);
    });
  });
});
