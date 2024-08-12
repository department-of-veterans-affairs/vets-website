import { expect } from 'chai';
import {
  allergyReducer,
  extractLocation,
  extractObservedReported,
} from '../../reducers/allergies';
import { EMPTY_FIELD, allergyTypes } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

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
    const allergy = {
      extension: [{ url: 'allergyObservedHistoric', valueCode: 'o' }],
    };
    expect(extractObservedReported(allergy)).to.equal(allergyTypes.OBSERVED);
  });

  it('should return REPORTED when valueCode is "h"', () => {
    const allergy = {
      extension: [{ url: 'allergyObservedHistoric', valueCode: 'h' }],
    };
    expect(extractObservedReported(allergy)).to.equal(allergyTypes.REPORTED);
  });

  it('should return EMPTY_FIELD when extension array is empty', () => {
    const allergy = { extension: [] };
    expect(extractObservedReported(allergy)).to.equal(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when extension does not contain the target url', () => {
    const allergy = {
      extension: [{ url: 'differentUrl', valueCode: 'o' }],
    };
    expect(extractObservedReported(allergy)).to.equal(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when valueCode is neither "o" nor "h"', () => {
    const allergy = {
      extension: [{ url: 'allergyObservedHistoric', valueCode: 'x' }],
    };
    expect(extractObservedReported(allergy)).to.equal(EMPTY_FIELD);
  });
});

describe('allergyReducer', () => {
  it('creates a list', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'AllergyIntolerance',
    };
    const newState = allergyReducer(
      {},
      { type: Actions.Allergies.GET_LIST, response },
    );
    expect(newState.allergiesList.length).to.equal(3);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('puts updated records in updatedList', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'AllergyIntolerance',
    };
    const newState = allergyReducer(
      {
        allergiesList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Allergies.GET_LIST, response },
    );
    expect(newState.allergiesList.length).to.equal(2);
    expect(newState.updatedList.length).to.equal(3);
  });

  it('moves updatedList into allergiesList on request', () => {
    const newState = allergyReducer(
      {
        allergiesList: [{ resource: { id: 1 } }],
        updatedList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Allergies.COPY_UPDATED_LIST },
    );
    expect(newState.allergiesList.length).to.equal(2);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('does not move updatedList into allergiesList if updatedList does not exist', () => {
    const newState = allergyReducer(
      {
        allergiesList: [{ resource: { id: 1 } }],
        updatedList: undefined,
      },
      { type: Actions.Allergies.COPY_UPDATED_LIST },
    );
    expect(newState.allergiesList.length).to.equal(1);
    expect(newState.updatedList).to.equal(undefined);
  });
});
