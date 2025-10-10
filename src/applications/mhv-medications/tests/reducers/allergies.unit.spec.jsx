import { expect } from 'chai';
import {
  convertAllergy,
  convertAcceleratedAllergy,
  extractLocation,
  extractObservedReported,
} from '../../api/allergiesApi';
import allergy from '../fixtures/allergy.json';
import acceleratedAllergies from '../fixtures/acceleratedAllergies.json';
import {
  allergyTypes,
  FIELD_NONE_NOTED,
  FIELD_NOT_AVAILABLE,
} from '../../util/constants';

describe('reducers', () => {
  context('parsing FHIR data from v1 endpoints', () => {
    describe('extractLocation function', () => {
      it('should return the name when all properties exist and conditions are met', () => {
        const allergyExample = {
          recorder: {
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
              name: 'LocationName',
            },
          ],
        };
        expect(extractLocation(allergyExample)).to.equal('LocationName');
      });

      it('should return FIELD_NOT_AVAILABLE when recorder or extension is undefined', () => {
        const allergyExample = {
          recorder: {
            // extension is missing
          },
          contained: [
            {
              id: 'org1',
              name: 'LocationName',
            },
          ],
        };
        expect(extractLocation(allergyExample)).to.equal(FIELD_NOT_AVAILABLE);
      });

      it('should return FIELD_NOT_AVAILABLE when reference is incorrect', () => {
        const allergyExample = {
          recorder: {
            extension: [
              {
                valueReference: {
                  reference: '#org2', // mismatched reference
                },
              },
            ],
          },
          contained: [
            {
              id: 'org1',
              name: 'LocationName',
            },
          ],
        };
        expect(extractLocation(allergyExample)).to.equal(FIELD_NOT_AVAILABLE);
      });

      it('should return FIELD_NOT_AVAILABLE when contained item does not have a name', () => {
        const allergyExample = {
          recorder: {
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
              // name is missing
            },
          ],
        };
        expect(extractLocation(allergyExample)).to.equal(FIELD_NOT_AVAILABLE);
      });
    });

    describe('extractObservedReported function', () => {
      it('should return OBSERVED when valueCode is "o"', () => {
        const allergyWithObserved = {
          extension: [{ url: 'allergyObservedHistoric', valueCode: 'o' }],
        };
        expect(extractObservedReported(allergyWithObserved)).to.equal(
          allergyTypes.OBSERVED,
        );
      });

      it('should return REPORTED when valueCode is "h"', () => {
        const allergyWithReported = {
          extension: [{ url: 'allergyObservedHistoric', valueCode: 'h' }],
        };
        expect(extractObservedReported(allergyWithReported)).to.equal(
          allergyTypes.REPORTED,
        );
      });

      it('should return FIELD_NOT_AVAILABLE when extension array is empty', () => {
        const allergyWithEmptyArray = { extension: [] };
        expect(extractObservedReported(allergyWithEmptyArray)).to.equal(
          FIELD_NOT_AVAILABLE,
        );
      });

      it('should return FIELD_NOT_AVAILABLE when extension does not contain the target url', () => {
        const allergyWithNotTargetUrl = {
          extension: [{ url: 'differentUrl', valueCode: 'o' }],
        };
        expect(extractObservedReported(allergyWithNotTargetUrl)).to.equal(
          FIELD_NOT_AVAILABLE,
        );
      });

      it('should return FIELD_NOT_AVAILABLE when valueCode is neither "o" nor "h"', () => {
        const allergyWithInvalidValueCode = {
          extension: [{ url: 'allergyObservedHistoric', valueCode: 'x' }],
        };
        expect(extractObservedReported(allergyWithInvalidValueCode)).to.equal(
          FIELD_NOT_AVAILABLE,
        );
      });
    });

    describe('convertAllergy function', () => {
      it('should return FIELD_NOT_AVAILABLE values', () => {
        const emptyFieldsAllergy = {
          ...allergy,
          category: null,
          code: { text: null },
          recordedDate: null,
          note: null,
        };
        const convertedAllergy = convertAllergy(emptyFieldsAllergy);
        expect(convertedAllergy.type).to.equal(FIELD_NOT_AVAILABLE);
        expect(convertedAllergy.name).to.equal(FIELD_NONE_NOTED);
        expect(convertedAllergy.date).to.equal(FIELD_NOT_AVAILABLE);
        expect(convertedAllergy.notes).to.equal(FIELD_NONE_NOTED);
      });

      it('should contain allergy name and id', () => {
        const convertedAllergy = convertAllergy(allergy);
        const allergyName = allergy.code.text;
        expect(convertedAllergy.name).to.equal(allergyName);
        expect(convertedAllergy.id).to.equal(allergy.id);
      });
    });
  });
  context(
    'parsing simple JSON object from accelerated allergies endpoint',
    () => {
      describe('convertAcceleratedAllergy function', () => {
        it('should return a VistA SCDF allergy with FIELD_NOT_AVAILABLE values', () => {
          const convertedAllergy = convertAcceleratedAllergy(
            acceleratedAllergies.data[0],
          );

          expect(convertedAllergy.id).to.equal('2678');
          expect(convertedAllergy.type).to.equal('Medication');
          expect(convertedAllergy.name).to.equal('TRAZODONE');
          expect(convertedAllergy.date).to.equal(FIELD_NOT_AVAILABLE);
          expect(convertedAllergy.reaction).to.deep.equal([FIELD_NONE_NOTED]);
          expect(convertedAllergy.location).to.equal(FIELD_NOT_AVAILABLE);
          expect(convertedAllergy.observedOrReported).to.equal(
            allergyTypes.REPORTED,
          );
          expect(convertedAllergy.notes).to.equal(FIELD_NONE_NOTED);
        });

        it('should return an OH SCDF allergy', () => {
          const convertedAllergy = convertAcceleratedAllergy(
            acceleratedAllergies.data[4],
          );

          expect(convertedAllergy.id).to.equal('132320343');
          expect(convertedAllergy.type).to.equal('Food');
          expect(convertedAllergy.name).to.equal('Radish (substance)');
          expect(convertedAllergy.date).to.equal('January 1, 1966');
          expect(convertedAllergy.reaction).to.deep.equal(['Depression']);
          expect(convertedAllergy.location).to.equal(FIELD_NOT_AVAILABLE);
          expect(convertedAllergy.observedOrReported).to.equal(
            FIELD_NOT_AVAILABLE,
          );
          expect(convertedAllergy.notes).to.equal(
            'Radish makes Hooper sad-ish :(',
          );
          expect(convertedAllergy.provider).to.equal(' Victoria A Borland');
        });
      });
    },
  );
});
