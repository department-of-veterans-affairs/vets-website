import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  allergiesReducer,
  extractLocation,
  extractObservedReported,
} from '../../reducers/allergies';
import allergies from '../../../medical-records/tests/fixtures/allergies.json';
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

describe('Allergies reducer', () => {
  const initialState = {
    allergiesList: undefined,
    error: undefined,
  };
  it('should update the allergies list', () => {
    const action = {
      type: Actions.Allergies.GET_LIST,
      response: allergies,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.allergiesList).to.exist;
  });

  it('should produce an empty list', () => {
    const action = {
      type: Actions.Allergies.GET_LIST,
      response: {},
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.allergiesList).to.exist;
  });

  it('should set the error tag to true', () => {
    const action = {
      type: Actions.Allergies.GET_LIST_ERROR,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.error).to.exist;
  });

  it('should clear the error tag', () => {
    const action = {
      type: Actions.Allergies.GET_LIST_ERROR_RESET,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.error).to.equal(undefined);
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
