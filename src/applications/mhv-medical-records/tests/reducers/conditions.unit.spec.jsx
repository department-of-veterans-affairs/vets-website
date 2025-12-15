import { expect } from 'chai';
import {
  conditionReducer,
  convertCondition,
  convertNewCondition,
  extractLocation,
  extractProvider,
  extractProviderNote,
} from '../../reducers/conditions';
import { Actions } from '../../util/actionTypes';
import { loadStates } from '../../util/constants';

const EMPTY_FIELD = 'None recorded';

describe('Condition Extraction Functions', () => {
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

describe('convertNewCondition', () => {
  it('should return null if not passed an argument', () => {
    expect(convertNewCondition()).to.eq(null);
  });

  it('should return null if null is passed as argument', () => {
    expect(convertNewCondition(null)).to.eq(null);
  });

  it('should correctly format date when date is provided', () => {
    const condition = {
      id: '123',
      name: 'Hypertension',
      date: '2023-12-07T08:43:00-05:00',
    };

    const result = convertNewCondition(condition);

    expect(result.date).to.eq('December 7, 2023');
  });

  it('should return "None recorded" for missing data fields', () => {
    const condition = {
      id: '123',
    };

    const result = convertNewCondition(condition);

    expect(result.name).to.eq(EMPTY_FIELD);
    expect(result.date).to.eq(EMPTY_FIELD);
    expect(result.provider).to.eq(EMPTY_FIELD);
    expect(result.facility).to.eq(EMPTY_FIELD);
    expect(result.comments).to.eq(EMPTY_FIELD);
  });

  it('should preserve all original properties and add formatted properties', () => {
    const condition = {
      id: '123',
      name: 'Hypertension',
      date: '2023-01-10',
      provider: 'Dr. Smith',
      facility: 'VA Hospital',
      comments: ['First visit', 'Follow-up needed'],
    };

    const result = convertNewCondition(condition);

    expect(result).to.include({
      id: '123',
      name: 'Hypertension',
      date: 'January 10, 2023',
      provider: 'Dr. Smith',
      facility: 'VA Hospital',
    });
    expect(result.comments).to.deep.equal(['First visit', 'Follow-up needed']);
  });
});

describe('convertUnifiedCondition', () => {
  it('should return null if not passed an argument', () => {
    expect(convertNewCondition()).to.eq(null);
  });

  it('should return null if null is passed as argument', () => {
    expect(convertNewCondition(null)).to.eq(null);
  });

  it('should correctly format date when date is provided', () => {
    const condition = {
      id: '123',
      name: 'Hypertension',
      date: '2023-12-07T08:43:00-05:00',
    };

    const result = convertNewCondition(condition);

    expect(result.date).to.eq('December 7, 2023');
  });

  it('should return "None recorded" for missing data fields', () => {
    const condition = {
      id: '123',
    };

    const result = convertNewCondition(condition);

    expect(result.name).to.eq(EMPTY_FIELD);
    expect(result.date).to.eq(EMPTY_FIELD);
    expect(result.provider).to.eq(EMPTY_FIELD);
    expect(result.facility).to.eq(EMPTY_FIELD);
    expect(result.comments).to.eq(EMPTY_FIELD);
  });

  it('should preserve all original properties and add formatted properties', () => {
    const condition = {
      id: '123',
      name: 'Hypertension',
      date: '2023-01-10',
      provider: 'Dr. Smith',
      facility: 'VA Hospital',
      comments: ['First visit', 'Follow-up needed'],
    };

    const result = convertNewCondition(condition);

    expect(result).to.include({
      id: '123',
      name: 'Hypertension',
      date: 'January 10, 2023',
      provider: 'Dr. Smith',
      facility: 'VA Hospital',
    });
    expect(result.comments).to.deep.equal(['First visit', 'Follow-up needed']);
  });
});

describe('conditionReducer', () => {
  describe('GET action', () => {
    it('should use convertCondition for FHIR format responses', () => {
      const fhirResponse = {
        resourceType: 'Condition',
        id: '123',
        recordedDate: '2023-05-15',
        code: { text: 'Type 2 Diabetes' },
      };

      const expectedCondition = convertCondition(fhirResponse);

      const newState = conditionReducer(
        {},
        { type: Actions.Conditions.GET, response: fhirResponse },
      );

      expect(newState.conditionDetails).to.deep.equal(expectedCondition);
    });

    it('should use convertNewCondition for non-FHIR format responses', () => {
      const nonFhirResponse = {
        data: {
          attributes: {
            id: '123',
            name: 'Type 2 Diabetes',
            date: '2023-05-15',
          },
        },
      };

      const expectedCondition = convertNewCondition(
        nonFhirResponse.data.attributes,
      );

      const newState = conditionReducer(
        {},
        { type: Actions.Conditions.GET, response: nonFhirResponse },
      );

      expect(newState.conditionDetails).to.deep.equal(expectedCondition);
    });

    it('should handle null response gracefully', () => {
      const newState = conditionReducer(
        {},
        { type: Actions.Conditions.GET, response: null },
      );

      expect(newState.conditionDetails).to.equal(null);
    });
  });

  describe('GET_LIST action', () => {
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

    it('should use convertCondition for FHIR format responses', () => {
      const fhirResponse = {
        resourceType: 'Bundle',
        entry: [
          {
            resource: {
              resourceType: 'Condition',
              id: '123',
              recordedDate: '2023-05-15',
              code: { text: 'Type 2 Diabetes' },
            },
          },
          {
            resource: {
              resourceType: 'Condition',
              id: '456',
              recordedDate: '2023-01-10',
              code: { text: 'Hypertension' },
            },
          },
        ],
      };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_LIST,
          response: fhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(2);
      expect(newState.conditionsList[0]).to.include({
        id: '123',
        name: 'Type 2 Diabetes',
      });
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });

    it('should use convertNewCondition for non-FHIR format responses', () => {
      const nonFhirResponse = {
        data: [
          {
            attributes: {
              id: '123',
              name: 'Type 2 Diabetes',
              date: '2023-05-15',
            },
          },
          {
            attributes: {
              id: '456',
              name: 'Hypertension',
              date: '2023-01-10',
            },
          },
        ],
      };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_LIST,
          response: nonFhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(2);
      expect(newState.conditionsList[0]).to.include({
        id: '123',
        name: 'Type 2 Diabetes',
      });
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });

    it('should properly handle no results for FHIR format responses', () => {
      const fhirResponse = { resourceType: 'Bundle' };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_LIST,
          response: fhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(0);
    });

    it('should properly handle no results for non-FHIR format responses', () => {
      const nonFhirResponse = { data: [] };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_LIST,
          response: nonFhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(0);
    });
  });

  describe('GET_UNIFIED_LIST action', () => {
    it('creates a list', () => {
      const response = {
        data: [
          { id: '1', attributes: { id: '1' } },
          { id: '2', attributes: { id: '2' } },
          { id: '3', attributes: { id: '3' } },
        ],
        resourceType: 'Condition',
      };
      const newState = conditionReducer(
        {},
        { type: Actions.Conditions.GET_UNIFIED_LIST, response },
      );
      expect(newState.conditionsList.length).to.equal(3);
      expect(newState.updatedList).to.equal(undefined);
    });

    it('puts new data in conditionsList', () => {
      const response = {
        data: [
          { id: '1', attributes: { id: '1' } },
          { id: '2', attributes: { id: '2' } },
          { id: '3', attributes: { id: '3' } },
        ],
        resourceType: 'Condition',
      };
      const newState = conditionReducer(
        {
          conditionsList: [
            { id: '123', attributes: { id: '123' } },
            { id: '234', attributes: { id: '234' } },
          ],
        },
        { type: Actions.Conditions.GET_UNIFIED_LIST, response },
      );
      expect(newState.conditionsList.length).to.equal(3);
      expect(newState.conditionsList[0].id).to.equal('1');
      expect(newState.conditionsList[1].id).to.equal('2');
      expect(newState.conditionsList[2].id).to.equal('3');
    });

    it('should use convertUnifiedCondition', () => {
      const unifiedResponse = {
        data: [
          {
            id: '123',
            attributes: {
              id: '123',
              name: 'Type 2 Diabetes',
              date: '2023-05-15',
            },
          },
          {
            id: '456',
            attributes: {
              id: '456',
              name: 'Hypertension',
              date: '2023-01-10',
            },
          },
        ],
      };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_UNIFIED_LIST,
          response: unifiedResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(2);
      expect(newState.conditionsList[0]).to.include({
        id: '123',
        name: 'Type 2 Diabetes',
      });
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });

    it('should properly handle no results for unified format responses', () => {
      const unifiedResponse = { data: [] };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_LIST,
          response: unifiedResponse,
          isCurrent: true,
        },
      );

      expect(newState.conditionsList).to.have.lengthOf(0);
    });

    it('sorts unified list by descending date and pushes invalid/missing dates last', () => {
      const unifiedResponse = {
        data: [
          {
            id: 'c3',
            attributes: {
              id: 'c3',
              name: 'Oldest Condition',
              date: '2023-01-10T09:00:00Z',
            },
          },
          {
            id: 'c1',
            attributes: {
              id: 'c1',
              name: 'Newest Condition',
              date: '2024-10-05T11:00:00Z',
            },
          },
          {
            id: 'c2',
            attributes: {
              id: 'c2',
              name: 'Middle Condition',
              date: '2024-05-15T08:00:00Z',
            },
          },
          {
            id: 'invalid',
            attributes: {
              id: 'invalid',
              name: 'Invalid Date Condition',
              date: 'not-a-real-date',
            },
          },
          {
            id: 'missing',
            attributes: {
              id: 'missing',
              name: 'Missing Date Condition',
            },
          },
        ],
      };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_UNIFIED_LIST,
          response: unifiedResponse,
          isCurrent: true,
        },
      );

      // Expect order: newest (2024-10-05), middle (2024-05-15), oldest (2023-01-10), then invalid, then missing
      expect(newState.conditionsList.map(c => c.id)).to.deep.equal([
        'c1',
        'c2',
        'c3',
        'invalid',
        'missing',
      ]);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
      expect(newState.listState).to.equal(loadStates.FETCHED);
    });

    it('sets listCurrentAsOf to null when isCurrent is false for unified list', () => {
      const unifiedResponse = {
        data: [
          {
            id: 'x1',
            attributes: {
              id: 'x1',
              name: 'Chronic Condition',
              date: '2024-09-01T00:00:00Z',
            },
          },
        ],
      };

      const newState = conditionReducer(
        {},
        {
          type: Actions.Conditions.GET_UNIFIED_LIST,
          response: unifiedResponse,
          isCurrent: false,
        },
      );

      expect(newState.conditionsList.map(c => c.id)).to.deep.equal(['x1']);
      expect(newState.listCurrentAsOf).to.equal(null);
      expect(newState.listState).to.equal(loadStates.FETCHED);
    });
  });

  describe('COPY_UPDATED_LIST action', () => {
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

  describe('CLEAR_DETAIL action', () => {
    it('should clear conditionDetails', () => {
      const initialState = {
        conditionDetails: { id: '123', name: 'Type 2 Diabetes' },
      };

      const newState = conditionReducer(initialState, {
        type: Actions.Conditions.CLEAR_DETAIL,
      });

      expect(newState.conditionDetails).to.equal(undefined);
    });
  });

  describe('UPDATE_LIST_STATE action', () => {
    it('should update listState to the provided payload', () => {
      const newState = conditionReducer(
        { listState: 'PRE_FETCH' },
        { type: Actions.Conditions.UPDATE_LIST_STATE, payload: 'FETCHING' },
      );

      expect(newState.listState).to.equal('FETCHING');
    });
  });
});
