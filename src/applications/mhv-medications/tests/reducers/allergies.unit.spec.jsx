import { expect } from 'chai';
import {
  convertAllergy,
  convertAcceleratedAllergy,
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
    describe('convertAllergy function', () => {
      describe('location extraction', () => {
        it('should return the location name when all properties exist and conditions are met', () => {
          const allergyExample = {
            id: '123',
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
          const result = convertAllergy(allergyExample);
          expect(result.location).to.equal('LocationName');
        });

        it('should return FIELD_NOT_AVAILABLE for location when recorder or extension is undefined', () => {
          const allergyExample = {
            id: '123',
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
          const result = convertAllergy(allergyExample);
          expect(result.location).to.equal(FIELD_NOT_AVAILABLE);
        });

        it('should return FIELD_NOT_AVAILABLE for location when reference is incorrect', () => {
          const allergyExample = {
            id: '123',
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
          const result = convertAllergy(allergyExample);
          expect(result.location).to.equal(FIELD_NOT_AVAILABLE);
        });

        it('should return FIELD_NOT_AVAILABLE for location when contained item does not have a name', () => {
          const allergyExample = {
            id: '123',
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
          const result = convertAllergy(allergyExample);
          expect(result.location).to.equal(FIELD_NOT_AVAILABLE);
        });
      });

      describe('observed/reported extraction', () => {
        it('should return OBSERVED when valueCode is "o"', () => {
          const allergyWithObserved = {
            id: '123',
            extension: [{ url: 'allergyObservedHistoric', valueCode: 'o' }],
          };
          const result = convertAllergy(allergyWithObserved);
          expect(result.observedOrReported).to.equal(allergyTypes.OBSERVED);
        });

        it('should return REPORTED when valueCode is "h"', () => {
          const allergyWithReported = {
            id: '123',
            extension: [{ url: 'allergyObservedHistoric', valueCode: 'h' }],
          };
          const result = convertAllergy(allergyWithReported);
          expect(result.observedOrReported).to.equal(allergyTypes.REPORTED);
        });

        it('should return FIELD_NOT_AVAILABLE when extension array is empty', () => {
          const allergyWithEmptyArray = { id: '123', extension: [] };
          const result = convertAllergy(allergyWithEmptyArray);
          expect(result.observedOrReported).to.equal(FIELD_NOT_AVAILABLE);
        });

        it('should return FIELD_NOT_AVAILABLE when extension does not contain the target url', () => {
          const allergyWithNotTargetUrl = {
            id: '123',
            extension: [{ url: 'differentUrl', valueCode: 'o' }],
          };
          const result = convertAllergy(allergyWithNotTargetUrl);
          expect(result.observedOrReported).to.equal(FIELD_NOT_AVAILABLE);
        });

        it('should return FIELD_NOT_AVAILABLE when valueCode is neither "o" nor "h"', () => {
          const allergyWithInvalidValueCode = {
            id: '123',
            extension: [{ url: 'allergyObservedHistoric', valueCode: 'x' }],
          };
          const result = convertAllergy(allergyWithInvalidValueCode);
          expect(result.observedOrReported).to.equal(FIELD_NOT_AVAILABLE);
        });
      });

      describe('field conversion', () => {
        it('should return FIELD_NOT_AVAILABLE values for missing fields', () => {
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

        it('should not include provider field (Medications-specific behavior)', () => {
          const allergyWithRecorder = {
            id: '123',
            recorder: { display: 'Dr. Smith' },
          };
          const result = convertAllergy(allergyWithRecorder);
          expect(result.provider).to.be.undefined;
        });

        it('should use only first category (Medications-specific behavior)', () => {
          const allergyWithCategories = {
            id: '123',
            category: ['medication', 'food'],
          };
          const result = convertAllergy(allergyWithCategories);
          expect(result.type).to.equal('Medication');
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
            expect(convertedAllergy.reaction).to.deep.equal([]);
            expect(convertedAllergy.location).to.equal(FIELD_NOT_AVAILABLE);
            expect(convertedAllergy.observedOrReported).to.equal(
              allergyTypes.REPORTED,
            );
            expect(convertedAllergy.notes).to.equal(FIELD_NOT_AVAILABLE);
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
});
