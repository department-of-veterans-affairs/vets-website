import { expect } from 'chai';
import {
  convertAllergy,
  extractLocation,
  extractObservedReported,
} from '../../api/allergiesApi';
import allergy from '../fixtures/allergy.json';
import { allergyTypes, EMPTY_FIELD } from '../../util/constants';

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

  it('should return EMPTY_FIELD when recorder or extension is undefined', () => {
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
    expect(extractLocation(allergyExample)).to.equal(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when reference is incorrect', () => {
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
    expect(extractLocation(allergyExample)).to.equal(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when contained item does not have a name', () => {
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
    expect(extractLocation(allergyExample)).to.equal(EMPTY_FIELD);
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

  it('should return EMPTY_FIELD when extension array is empty', () => {
    const allergyWithEmptyArray = { extension: [] };
    expect(extractObservedReported(allergyWithEmptyArray)).to.equal(
      EMPTY_FIELD,
    );
  });

  it('should return EMPTY_FIELD when extension does not contain the target url', () => {
    const allergyWithNotTargetUrl = {
      extension: [{ url: 'differentUrl', valueCode: 'o' }],
    };
    expect(extractObservedReported(allergyWithNotTargetUrl)).to.equal(
      EMPTY_FIELD,
    );
  });

  it('should return EMPTY_FIELD when valueCode is neither "o" nor "h"', () => {
    const allergyWithInvalidValueCode = {
      extension: [{ url: 'allergyObservedHistoric', valueCode: 'x' }],
    };
    expect(extractObservedReported(allergyWithInvalidValueCode)).to.equal(
      EMPTY_FIELD,
    );
  });
});

describe('convertAllergy function', () => {
  it('should return EMPTY_FIELD values', () => {
    const emptyFieldsAllergy = {
      ...allergy,
      category: null,
      code: { text: null },
      recordedDate: null,
      note: null,
    };
    const convertedAllergy = convertAllergy(emptyFieldsAllergy);
    expect(convertedAllergy.type).to.equal(EMPTY_FIELD);
    expect(convertedAllergy.name).to.equal(EMPTY_FIELD);
    expect(convertedAllergy.date).to.equal(EMPTY_FIELD);
    expect(convertedAllergy.notes).to.equal(EMPTY_FIELD);
  });

  it('should contain allergy name and id', () => {
    const convertedAllergy = convertAllergy(allergy);
    const allergyName = allergy.code.text;
    expect(convertedAllergy.name).to.equal(allergyName);
    expect(convertedAllergy.id).to.equal(allergy.id);
  });
});
