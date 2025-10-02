import { expect } from 'chai';
import {
  extractLocation,
  vitalReducer,
  getMeasurement,
  convertVital,
} from '../../reducers/vitals';
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

  it('should return the organization display name if performer references organizations', () => {
    const vital = {
      performer: [
        {
          reference: 'https://example.org/r4/Practitioner/1',
        },
        {
          reference: 'https://example.org/r4/Organization/1',
          display: 'Organization One',
        },
      ],
    };
    const location = extractLocation(vital);
    expect(location).to.equal('Organization One');
  });

  it('should return multiple organization display names joined by a comma', () => {
    const vital = {
      performer: [
        {
          reference: 'https://example.org/r4/Organization/1',
          display: 'Organization One',
        },
        {
          reference: 'https://example.org/r4/Practitioner/1',
        },
        {
          reference: 'https://example.org/r4/Organization/2',
          display: 'Organization Two',
        },
      ],
    };
    const location = extractLocation(vital);
    expect(location).to.equal('Organization One, Organization Two');
  });

  it('should return EMPTY_FIELD if performer has no extension or organization references', () => {
    const vital = {
      performer: [
        {
          reference: 'https://example.org/r4/Practitioner/1',
        },
      ],
    };
    const location = extractLocation(vital);
    expect(location).to.equal(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD if performer is not an array or is empty', () => {
    const vital = {
      performer: [],
    };
    const location = extractLocation(vital);
    expect(location).to.equal(EMPTY_FIELD);
  });
});

describe('vitalReducer', () => {
  it('creates a list', () => {
    const response = {
      entry: [
        {
          resource: {
            id: 1,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
        {
          resource: {
            id: 2,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
        {
          resource: {
            id: 3,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
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
        {
          resource: {
            id: 1,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
        {
          resource: {
            id: 2,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
        {
          resource: {
            id: 3,
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
          },
        },
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

  it('ignores records without allowed types', () => {
    const response = {
      entry: [
        { resource: { id: 1, code: { coding: [{ code: '1234-5' }] } } },
        { resource: { id: 2, code: { coding: [{ code: '1234-5' }] } } },
        { resource: { id: 3, code: { coding: [{ code: '1234-5' }] } } },
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
    expect(newState.updatedList.length).to.equal(0);
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

describe('getMeasurement', () => {
  it('should return the correct measurement for a given type', () => {
    const record = {
      component: [
        {
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '8867-4',
                display: 'Heart rate',
              },
            ],
          },
        },
      ],
      valueQuantity: {
        value: 72,
        code: 'beats per minute',
      },
    };
    const type = 'HEART_RATE';
    const measurement = getMeasurement(record, type);
    expect(measurement).to.equal('72 beats per minute');
  });

  it('should return the correct measurement for a given type when there are multiple codes', () => {
    const record = require('../fixtures/vitalOhBloodPressure.json').resource;
    const type = 'BLOOD_PRESSURE';
    const measurement = getMeasurement(record, type);
    expect(measurement).to.equal('125/79');
  });

  it('should return EMPTY_FIELD if the record is empty', () => {
    const record = {};
    const type = 'HEART_RATE';
    const measurement = getMeasurement(record, type);
    expect(measurement).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD if the component array is empty', () => {
    const record = {
      component: [],
    };
    const type = 'HEART_RATE';
    const measurement = getMeasurement(record, type);
    expect(measurement).to.eq(EMPTY_FIELD);
  });
});

describe('convertVital normalization', () => {
  const baseRecord = {
    id: '1',
    code: { text: 'Heart Rate' },
    effectiveDateTime: '2024-01-01T10:00:00Z',
    valueQuantity: { value: 70, code: '/min' },
  };

  it('normalizes HEART_RATE to PULSE', () => {
    const converted = convertVital(baseRecord);
    expect(converted.type).to.equal('PULSE');
  });

  it('normalizes BODY WEIGHT variants to WEIGHT', () => {
    const record = { ...baseRecord, code: { text: 'Body Weight' } };
    const converted = convertVital(record);
    expect(converted.type).to.equal('WEIGHT');
  });

  it('normalizes SpO2 variants to PULSE_OXIMETRY', () => {
    const record = { ...baseRecord, code: { text: 'Sp O2' } };
    const converted = convertVital(record);
    expect(converted.type).to.equal('PULSE_OXIMETRY');
  });

  it('normalizes OXYGEN_SATURATION_IN_ARTERIAL_BLOOD to PULSE_OXIMETRY', () => {
    const record = {
      ...baseRecord,
      code: { text: 'Oxygen Saturation in Arterial Blood' },
    };
    const converted = convertVital(record);
    expect(converted.type).to.equal('PULSE_OXIMETRY');
  });
});

describe('vitalReducer OTHER aggregation', () => {
  it('aggregates truly unknown vital codes into OTHER', () => {
    const response = {
      entry: [
        {
          resource: {
            id: 'u1',
            code: {
              coding: [{ code: '8310-5' }],
              text: 'Not A Standard Vital 1',
            },
            effectiveDateTime: '2024-01-01T10:00:00Z',
            valueQuantity: { value: 10, code: '%' },
          },
        },
        {
          resource: {
            id: 'u2',
            code: {
              coding: [{ code: '8310-5' }],
              text: 'Not A Standard Vital 2',
            },
            effectiveDateTime: '2024-02-01T10:00:00Z',
            valueQuantity: { value: 20, code: '%' },
          },
        },
        {
          resource: {
            id: 't1',
            code: { coding: [{ code: '8310-5' }], text: 'Body temperature' },
            effectiveDateTime: '2024-03-01T10:00:00Z',
            valueQuantity: { value: 98, code: '[degF]' },
          },
        },
      ],
      resourceType: 'Observation',
    };
    const newState = vitalReducer(
      {},
      { type: Actions.Vitals.GET_LIST, response },
    );
    const other = newState.vitalsList.find(v => v.type === 'OTHER');
    const temps = newState.vitalsList.filter(v => v.type === 'TEMPERATURE');
    expect(temps.length).to.equal(1); // only the canonical temperature record
    expect(other).to.exist; // aggregated unknown vitals
    expect(other._otherItems.length).to.equal(2); // both unknown items captured
    expect(other.effectiveDateTime).to.equal('2024-02-01T10:00:00Z'); // most recent unknown
    expect(other.measurement).to.equal('20 %'); // measurement from most recent unknown
  });
});
