import { expect } from 'chai';
import {
  allergyReducer,
  extractLocation,
  extractObservedReported,
  convertUnifiedAllergy,
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

describe('convertUnifiedAllergy function', () => {
  it('should convert unified allergy data correctly', () => {
    const unifiedAllergy = {
      id: '123',
      type: 'allergy',
      attributes: {
        id: '123',
        name: 'Test Allergy',
        categories: ['medication', 'food'], // Backend sends lowercase
        date: '2024-01-01T12:00:00.000+00:00',
        reactions: ['Hives', 'Swelling'], // Backend sends 'reactions' array
        location: 'VA Medical Center',
        observedHistoric: null, // Backend sends null for Oracle Health FHIR data
        notes: ['Test notes'],
        provider: 'Dr. Test',
      },
    };

    const converted = convertUnifiedAllergy(unifiedAllergy);

    expect(converted.id).to.equal('123');
    expect(converted.name).to.equal('Test Allergy');
    expect(converted.type).to.equal('Medication, food'); // Capitalizes first letter only
    expect(converted.reaction).to.deep.equal(['Hives', 'Swelling']); // Frontend converts to 'reaction'
    expect(converted.location).to.equal('VA Medical Center');
    expect(converted.observedOrReported).to.equal(EMPTY_FIELD); // Oracle Health doesn't have this field
    expect(converted.notes).to.equal('Test notes');
    expect(converted.provider).to.equal('Dr. Test');
    expect(converted.date).to.equal('January 1, 2024');
    expect(typeof converted.sortKey).to.equal('object'); // sortKey is now a Date object
  });

  it('should handle missing data gracefully', () => {
    const unifiedAllergy = {
      id: '123',
      type: 'allergy',
      attributes: {},
    };

    const converted = convertUnifiedAllergy(unifiedAllergy);

    expect(converted.id).to.equal('123');
    expect(converted.name).to.equal(EMPTY_FIELD);
    expect(converted.type).to.equal(EMPTY_FIELD);
    expect(converted.reaction).to.equal(EMPTY_FIELD);
    expect(converted.location).to.equal(EMPTY_FIELD);
    expect(converted.observedOrReported).to.equal(EMPTY_FIELD);
    expect(converted.notes).to.equal(EMPTY_FIELD);
    expect(converted.provider).to.equal(EMPTY_FIELD);
    expect(converted.date).to.equal(EMPTY_FIELD);
    expect(converted.sortKey).to.be.null;
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

  it('should handle GET_UNIFIED_LIST action', () => {
    const response = {
      data: [
        {
          id: '123',
          type: 'allergy',
          attributes: {
            id: '123',
            name: 'Test Allergy',
            categories: ['Medication'],
            date: '2024-01-01T00:00:00.000+00:00',
            reactions: ['Hives'],
            location: 'VA Medical Center',
            observedHistoric: 'Observed',
            notes: ['Test notes'],
            provider: 'Dr. Test',
          },
        },
      ],
    };
    const newState = allergyReducer(
      { allergiesList: undefined },
      { type: Actions.Allergies.GET_UNIFIED_LIST, response, isCurrent: true },
    );
    expect(newState.allergiesList.length).to.equal(1);
    expect(newState.allergiesList[0].name).to.equal('Test Allergy');
    expect(newState.listCurrentAsOf).to.not.be.null;
  });

  it('should handle GET_UNIFIED_ITEM action', () => {
    const response = {
      data: {
        id: '123',
        type: 'allergy',
        attributes: {
          id: '123',
          name: 'Test Allergy',
          categories: ['Medication'],
          date: '2024-01-01T00:00:00.000+00:00',
          reactions: ['Hives'],
          location: 'VA Medical Center',
          observedHistoric: 'Observed',
          notes: ['Test notes'],
          provider: 'Dr. Test',
        },
      },
    };
    const newState = allergyReducer(
      {},
      { type: Actions.Allergies.GET_UNIFIED_ITEM, response },
    );
    expect(newState.allergyDetails.name).to.equal('Test Allergy');
    expect(newState.allergyDetails.id).to.equal('123');
  });
});
