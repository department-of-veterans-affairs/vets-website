import { expect } from 'chai';
import {
  extractLocation,
  vitalReducer,
  getMeasurement,
  convertVital,
  convertUnifiedVital,
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
  it('handles GET when vitalsList is undefined without throwing', () => {
    const action = { type: Actions.Vitals.GET, vitalType: 'WEIGHT' };
    // Previously this would throw TypeError: cannot read properties of undefined (filter)
    const newState = vitalReducer({}, action);
    expect(newState.vitalDetails).to.be.an('array');
    expect(newState.vitalDetails.length).to.equal(0);
  });

  it('creates a list', () => {
    const response = {
      entry: [
        { resource: { id: 1, code: { coding: [{ code: '8310-5' }] } } },
        { resource: { id: 2, code: { coding: [{ code: '8310-5' }] } } },
        { resource: { id: 3, code: { coding: [{ code: '8310-5' }] } } },
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
        { resource: { id: 1, code: { coding: [{ code: '8310-5' }] } } },
        { resource: { id: 2, code: { coding: [{ code: '8310-5' }] } } },
        { resource: { id: 3, code: { coding: [{ code: '8310-5' }] } } },
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

  it('handles entries with missing code.coding without crashing', () => {
    const response = {
      entry: [
        { resource: { id: 1, code: {} } }, // missing coding array
        { resource: { id: 2 } }, // missing code entirely
        { resource: { id: 3, code: { coding: [{ code: '8310-5' }] } } }, // valid
      ],
      resourceType: 'Observation',
    };
    expect(() => {
      vitalReducer({}, { type: Actions.Vitals.GET_LIST, response });
    }).to.not.throw();
    const newState = vitalReducer(
      {},
      { type: Actions.Vitals.GET_LIST, response },
    );
    expect(newState.vitalsList.length).to.equal(1);
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

describe('vitalReducer LOINC mapping', () => {
  it('maps alternate weight LOINC 3141-9 to WEIGHT', () => {
    const response = {
      entry: [
        { resource: { id: 'w1', code: { coding: [{ code: '3141-9' }] } } },
      ],
      resourceType: 'Observation',
    };
    const newState = vitalReducer(
      {},
      { type: Actions.Vitals.GET_LIST, response },
    );
    expect(newState.vitalsList[0].type).to.equal('WEIGHT');
  });

  it('maps pulse oximetry LOINCs to PULSE_OXIMETRY', () => {
    const response = {
      entry: [
        { resource: { id: 'o1', code: { coding: [{ code: '59408-5' }] } } },
        { resource: { id: 'o2', code: { coding: [{ code: '2708-6' }] } } },
      ],
      resourceType: 'Observation',
    };
    const newState = vitalReducer(
      {},
      { type: Actions.Vitals.GET_LIST, response },
    );
    expect(newState.vitalsList[0].type).to.equal('PULSE_OXIMETRY');
    expect(newState.vitalsList[1].type).to.equal('PULSE_OXIMETRY');
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

  it('formats pulse oximetry without a space before %', () => {
    const record = {
      valueQuantity: {
        value: 84,
        code: '%',
      },
    };
    const type = 'PULSE_OXIMETRY';
    const measurement = getMeasurement(record, type);
    expect(measurement).to.equal('84%');
  });

  it('should return EMPTY_FIELD for blood pressure when component is missing or empty', () => {
    const type = 'BLOOD_PRESSURE';

    expect(getMeasurement({}, type)).to.eq(EMPTY_FIELD);
    expect(getMeasurement({ component: null }, type)).to.eq(EMPTY_FIELD);
    expect(getMeasurement({ component: [] }, type)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD for blood pressure when systolic or diastolic is missing', () => {
    const type = 'BLOOD_PRESSURE';

    const onlyDiastolic = {
      component: [
        {
          code: { coding: [{ code: '8462-4' }] },
          valueQuantity: { value: 79 },
        },
      ],
    };
    expect(getMeasurement(onlyDiastolic, type)).to.eq(EMPTY_FIELD);

    const onlySystolic = {
      component: [
        {
          code: { coding: [{ code: '8480-6' }] },
          valueQuantity: { value: 125 },
        },
      ],
    };
    expect(getMeasurement(onlySystolic, type)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD for blood pressure when component items are malformed', () => {
    const type = 'BLOOD_PRESSURE';

    const missingValueQuantity = {
      component: [
        { code: { coding: [{ code: '8480-6' }] } },
        {
          code: { coding: [{ code: '8462-4' }] },
          valueQuantity: { value: 79 },
        },
      ],
    };
    expect(getMeasurement(missingValueQuantity, type)).to.eq(EMPTY_FIELD);

    const missingCoding = {
      component: [
        { valueQuantity: { value: 125 } },
        { code: {}, valueQuantity: { value: 79 } },
      ],
    };
    expect(getMeasurement(missingCoding, type)).to.eq(EMPTY_FIELD);
  });
});

describe('convertUnifiedVital function', () => {
  it('should convert a unified vital record to the expected format with date in user timezone', () => {
    const record = {
      id: '49c80309-efa0-41fd-84a0-870ed1b38100',
      type: 'observation',
      attributes: {
        id: '49c80309-efa0-41fd-84a0-870ed1b38100',
        name: 'Height',
        type: 'HEIGHT',
        date: '2024-11-14T18:19:23Z',
        measurement: '6 feet, 3.0 inches',
        location: 'FT COLLINS HEALTH SCREENING',
        notes: ['Patient was calm during measurement.'],
      },
    };

    const converted = convertUnifiedVital(record);
    expect(converted.id).to.equal('49c80309-efa0-41fd-84a0-870ed1b38100');
    expect(converted.type).to.equal('HEIGHT');
    expect(converted.name).to.equal('Height');
    expect(converted.measurement).to.equal('6 feet, 3.0 inches');
    expect(converted.effectiveDateTime).to.equal('2024-11-14T18:19:23Z');
    expect(converted.location).to.equal('FT COLLINS HEALTH SCREENING');
    expect(converted.notes).to.equal('Patient was calm during measurement.');
    // Date is formatted in user timezone with timezone abbreviation (UTC 18:19 → local time)
    expect(converted.date).to.include('November 14, 2024');
    expect(converted.date).to.match(
      /\d{1,2}:\d{2} (a\.m\.|p\.m\.) [A-Z]{2,4}$/,
    );
  });
});

describe('convertVital function', () => {
  it('should convert a FHIR vital record to the expected format', () => {
    const record = {
      code: {
        coding: [
          {
            code: '85354-9',
            display: 'Blood pressure panel with all children optional',
            system: 'http://loinc.org',
          },
          {
            code: '4500634',
            display: 'BLOOD PRESSURE',
            system: 'urn:oid:2.16.840.1.113883.6.233',
          },
        ],
        text: 'BLOOD PRESSURE',
      },
      component: [
        {
          code: {
            coding: [
              {
                code: '8480-6',
                display: 'Systolic blood pressure',
                system: 'http://loinc.org',
              },
            ],
          },
          valueQuantity: {
            code: 'mm[Hg]',
            system: 'http://unitsofmeasure.org',
            unit: 'mm[Hg]',
            value: 130,
          },
        },
        {
          code: {
            coding: [
              {
                code: '8462-4',
                display: 'Diastolic blood pressure',
                system: 'http://loinc.org',
              },
            ],
          },
          valueQuantity: {
            code: 'mm[Hg]',
            system: 'http://unitsofmeasure.org',
            unit: 'mm[Hg]',
            value: 70,
          },
        },
      ],
      contained: [
        {
          id: 'Location-0',
          name: 'ADTP BURNETT',
          resourceType: 'Location',
        },
      ],
      effectiveDateTime: '2023-10-27T10:00:00-04:00',
      id: '38852',
      performer: [
        {
          display: 'ADTP BURNETT',
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: {
                reference: '#Location-0',
              },
            },
          ],
        },
      ],
      resourceType: 'Observation',
    };

    const converted = convertVital(record);
    expect(converted).to.deep.equal({
      id: '38852',
      type: 'BLOOD_PRESSURE',
      name: 'BLOOD PRESSURE',
      measurement: '130/70',
      date: 'October 27, 2023, 10:00 a.m.',
      effectiveDateTime: '2023-10-27T10:00:00-04:00',
      location: 'ADTP BURNETT',
      notes: 'None recorded',
    });
  });
});
