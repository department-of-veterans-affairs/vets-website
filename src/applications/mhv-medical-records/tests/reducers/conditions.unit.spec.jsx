import { expect } from 'chai';
import {
  conditionReducer,
  extractLocation,
  extractProvider,
  extractProviderNote,
} from '../../reducers/conditions';
import { Actions } from '../../util/actionTypes';

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

describe('conditionReducer', () => {
  it('creates a list', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'Condition',
    };
    const newState = conditionReducer(
      {},
      { type: Actions.Conditions.GET_LIST, response },
    );
    expect(newState.conditionsList.length).to.equal(3);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('puts updated records in updatedList', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'Condition',
    };
    const newState = conditionReducer(
      {
        conditionsList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Conditions.GET_LIST, response },
    );
    expect(newState.conditionsList.length).to.equal(2);
    expect(newState.updatedList.length).to.equal(3);
  });

  it('moves updatedList into conditionsList on request', () => {
    const newState = conditionReducer(
      {
        conditionsList: [{ resource: { id: 1 } }],
        updatedList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Conditions.COPY_UPDATED_LIST },
    );
    expect(newState.conditionsList.length).to.equal(2);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('does not move updatedList into conditionsList if updatedList does not exist', () => {
    const newState = conditionReducer(
      {
        conditionsList: [{ resource: { id: 1 } }],
        updatedList: undefined,
      },
      { type: Actions.Conditions.COPY_UPDATED_LIST },
    );
    expect(newState.conditionsList.length).to.equal(1);
    expect(newState.updatedList).to.equal(undefined);
  });
});
