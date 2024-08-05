import { expect } from 'chai';
import { extractLocation, vitalReducer } from '../../reducers/vitals';
import { EMPTY_FIELD } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

describe('extractLocation function', () => {
  it('should return the location name when vital.performer[0].extension[0].valueReference.reference is valid', () => {
    const vital = {
      contained: [{ id: 'location1', name: 'Location Name' }],
      performer: [
        { extension: [{ valueReference: { reference: '#location1' } }] },
      ],
    };
    expect(extractLocation(vital)).to.eq('Location Name');
  });

  it('should return EMPTY_FIELD when vital.performer is not an array or empty', () => {
    const vital = {};
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);

    vital.performer = [];
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when vital.performer[0].extension is not an array or empty', () => {
    const vital = {
      performer: [{}],
    };
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);

    vital.performer[0].extension = [];
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when vital.performer[0].extension[0].valueReference.reference is not present', () => {
    const vital = {
      performer: [{ extension: [{}] }],
    };
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when extractContainedResource returns a location without a name', () => {
    const vital = {
      contained: [{ id: 'location1' }],
      performer: [
        { extension: [{ valueReference: { reference: '#location1' } }] },
      ],
    };

    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });
});

describe('vitalReducer', () => {
  it('creates a list', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'Observation',
    };
    const newState = vitalReducer(
      {},
      { type: Actions.Vitals.GET_LIST, response },
    );
    expect(newState.vitalsList.length).to.equal(3);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('puts updated records in updatedList', () => {
    const response = {
      entry: [
        { resource: { id: 1 } },
        { resource: { id: 2 } },
        { resource: { id: 3 } },
      ],
      resourceType: 'Observation',
    };
    const newState = vitalReducer(
      {
        vitalsList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Vitals.GET_LIST, response },
    );
    expect(newState.vitalsList.length).to.equal(2);
    expect(newState.updatedList.length).to.equal(3);
  });

  it('moves updatedList into vitalsList on request', () => {
    const newState = vitalReducer(
      {
        vitalsList: [{ resource: { id: 1 } }],
        updatedList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
      },
      { type: Actions.Vitals.COPY_UPDATED_LIST },
    );
    expect(newState.vitalsList.length).to.equal(2);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('does not move updatedList into vitalsList if updatedList does not exist', () => {
    const newState = vitalReducer(
      {
        vitalsList: [{ resource: { id: 1 } }],
        updatedList: undefined,
      },
      { type: Actions.Vitals.COPY_UPDATED_LIST },
    );
    expect(newState.vitalsList.length).to.equal(1);
    expect(newState.updatedList).to.equal(undefined);
  });
});
