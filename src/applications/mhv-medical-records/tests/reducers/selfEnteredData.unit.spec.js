import { expect } from 'chai';
import {
  convertVitals,
  convertVitalsBloodPressure,
  convertVitalsBloodSugar,
  convertVitalsBodyTemp,
  convertVitalsBodyWeight,
  convertVitalsCholesterol,
  convertVitalsHeartRate,
  convertVitalsInr,
  convertVitalsPain,
  convertVitalsPulseOx,
  formatDate,
  formatTime,
  formatTimestamp,
  mapValue,
  NONE_ENTERED,
  convertAllergies,
} from '../../reducers/selfEnteredData';
import seiVitals from '../fixtures/sei/seiVitals.json';

describe('mapValue', () => {
  it('returns the corresponding value for a valid key', () => {
    const map = { a: 1, b: 2, c: 3 };
    expect(mapValue(map, 'a')).to.eq(1);
    expect(mapValue(map, 'b')).to.eq(2);
  });

  it('returns null for a key that does not exist', () => {
    const map = { a: 1, b: 2 };
    expect(mapValue(map, 'c')).to.be.null;
  });

  it('returns null if the key exists but the value is undefined', () => {
    const map = { a: undefined, b: 2 };
    expect(mapValue(map, 'a')).to.be.null;
  });

  it('returns the correct value even if the value is falsy', () => {
    const map = { a: 0, b: false, c: '' };
    expect(mapValue(map, 'a')).to.eq(0);
    expect(mapValue(map, 'b')).to.eq(false);
    expect(mapValue(map, 'c')).to.eq('');
  });

  it('returns null when map is null or undefined', () => {
    expect(mapValue(null, 'a')).to.be.null;
    expect(mapValue(undefined, 'a')).to.be.null;
  });

  it('returns null when map is not an object', () => {
    expect(mapValue(42, 'a')).to.be.null;
    expect(mapValue('string', 'a')).to.be.null;
  });

  it('returns null when key is undefined', () => {
    const map = { a: 1 };
    expect(mapValue(map, undefined)).to.be.null;
  });

  it('returns null when key is null', () => {
    const map = { null: 'null value' };
    expect(mapValue(map, null)).to.be.null;
  });

  it('returns value when key is an empty string', () => {
    const map = { '': 'empty' };
    expect(mapValue(map, '')).to.eq('empty');
  });
});

describe('formatTimestamp', () => {
  it('returns a formatted date for a valid timestamp in seconds', () => {
    expect(formatTimestamp(1625155200000)).to.eq('July 1, 2021');
    expect(formatTimestamp(1582995600000)).to.eq('February 29, 2020');
  });

  it('returns null for a null timestamp', () => {
    expect(formatTimestamp(null)).to.be.null;
  });

  it('returns null for an undefined timestamp', () => {
    expect(formatTimestamp(undefined)).to.be.null;
  });

  it('returns null for a non-numeric timestamp', () => {
    expect(formatTimestamp('not a number')).to.be.null;
  });

  it('returns null for NaN', () => {
    expect(formatTimestamp(NaN)).to.be.null;
  });
});

describe('formatDate', () => {
  it('returns formatted date for MM/DD/YYYY input', () => {
    expect(formatDate('05/01/2024')).to.eq('May 1, 2024');
  });

  it('returns formatted date for YYYY-MM-DD input', () => {
    expect(formatDate('2024-05-01')).to.eq('May 1, 2024');
  });

  it('returns formatted date and ignores time portion', () => {
    expect(formatDate('2024-05-01T12:34:56')).to.eq('May 1, 2024');
  });

  it('returns null for invalid date format', () => {
    expect(formatDate('invalid date')).to.be.null;
  });

  it('returns null for empty string', () => {
    expect(formatDate('')).to.be.null;
  });

  it('returns null for null input', () => {
    expect(formatDate(null)).to.be.null;
  });

  it('returns null for undefined input', () => {
    expect(formatDate(undefined)).to.be.null;
  });

  it('handles dates with single-digit months and days', () => {
    expect(formatDate('7/4/2024')).to.eq('July 4, 2024');
    expect(formatDate('2024-7-4')).to.eq('July 4, 2024');
  });

  it('returns null for invalid month in MM/DD/YYYY', () => {
    expect(formatDate('13/01/2024')).to.be.null;
  });

  it('returns null for invalid day in MM/DD/YYYY', () => {
    expect(formatDate('12/32/2024')).to.be.null;
  });

  it('returns null for invalid month in YYYY-MM-DD', () => {
    expect(formatDate('2024-13-01')).to.be.null;
  });

  it('returns null for invalid day in YYYY-MM-DD', () => {
    expect(formatDate('2024-12-32')).to.be.null;
  });
});

describe('formatTime', () => {
  it('returns the time formatted as HHMM for input in HHMM format', () => {
    expect(formatTime('2100')).to.eq('2100');
    expect(formatTime('0905')).to.eq('0905');
    expect(formatTime('2359')).to.eq('2359');
    expect(formatTime('0000')).to.eq('0000');
  });

  it('returns the time formatted as HHMM for input in HH:MM format', () => {
    expect(formatTime('21:00')).to.eq('2100');
    expect(formatTime('9:05')).to.eq('0905');
    expect(formatTime('09:05')).to.eq('0905');
    expect(formatTime('23:59')).to.eq('2359');
    expect(formatTime('00:00')).to.eq('0000');
  });

  it('returns null for invalid time formats', () => {
    expect(formatTime('9:5')).to.be.null;
    expect(formatTime('9')).to.be.null;
    expect(formatTime('abc')).to.be.null;
    expect(formatTime('12:345')).to.be.null;
    expect(formatTime('')).to.be.null;
    expect(formatTime('23:')).to.be.null;
    expect(formatTime(':00')).to.be.null;
  });

  it('returns null when inputTime is null or undefined', () => {
    expect(formatTime(null)).to.be.null;
    expect(formatTime(undefined)).to.be.null;
  });
});

describe('convertVitalsBloodPressure', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '01/07/2022',
        timeEntered: '08:20',
        diastolic: 40,
        comments: 'test',
        systolic: 150,
      },
    ];
    const expected = [
      {
        date: 'January 7, 2022',
        time: '0820',
        diastolic: 40,
        comments: 'test',
        systolic: 150,
      },
    ];
    expect(convertVitalsBloodPressure(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        date: NONE_ENTERED,
        time: NONE_ENTERED,
        diastolic: NONE_ENTERED,
        comments: NONE_ENTERED,
        systolic: NONE_ENTERED,
      },
    ];
    expect(convertVitalsBloodPressure(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsBloodPressure([])).to.deep.equal([]);
  });
});

describe('convertVitalsBloodSugar', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '09:20',
        comments: 'Some comments',
        testingMethod: 'CLT',
        bloodSugarCount: 110,
      },
    ];
    const expected = [
      {
        bloodSugarCount: 110,
        comments: 'Some comments',
        date: 'December 15, 2021',
        method: 'Clinical Lab Test',
        time: '0920',
      },
    ];
    expect(convertVitalsBloodSugar(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        bloodSugarCount: NONE_ENTERED,
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        method: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsBloodSugar(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsBloodSugar([])).to.deep.equal([]);
  });
});

describe('convertVitalsBodyTemp', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '09:20',
        comments: 'Some comments',
        bodyTemperature: 98.3,
        measure: 'F',
        bodyTemperatureMethod: 'M',
      },
    ];
    const expected = [
      {
        bodyTemperature: 98.3,
        comments: 'Some comments',
        date: 'December 15, 2021',
        measure: 'Fahrenheit',
        method: 'Mouth',
        time: '0920',
      },
    ];
    expect(convertVitalsBodyTemp(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        bodyTemperature: NONE_ENTERED,
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        measure: NONE_ENTERED,
        method: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsBodyTemp(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsBodyTemp([])).to.deep.equal([]);
  });
});

describe('convertVitalsBodyWeight', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '01/07/2022',
        timeEntered: '15:30',
        bodyweight: 170,
        comments: 'test',
        bodyweightMeasure: 'P',
      },
    ];
    const expected = [
      {
        bodyWeight: 170,
        comments: 'test',
        date: 'January 7, 2022',
        measure: 'Pounds',
        time: '1530',
      },
    ];
    expect(convertVitalsBodyWeight(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        bodyWeight: NONE_ENTERED,
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        measure: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsBodyWeight(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsBodyWeight([])).to.deep.equal([]);
  });
});

describe('convertVitalsCholesterol', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '11:11',
        total: 450,
        hdl: 320,
        ldl: 150,
        comments: 'some comments',
      },
    ];
    const expected = [
      {
        comments: 'some comments',
        date: 'December 15, 2021',
        hdl: 320,
        ldl: 150,
        time: '1111',
        totalCholesterol: 450,
      },
    ];
    expect(convertVitalsCholesterol(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        hdl: NONE_ENTERED,
        ldl: NONE_ENTERED,
        time: NONE_ENTERED,
        totalCholesterol: NONE_ENTERED,
      },
    ];
    expect(convertVitalsCholesterol(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsCholesterol([])).to.deep.equal([]);
  });
});

describe('convertVitalsHeartRate', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '09:40',
        comments: 'some comments',
        heartRate: 90,
      },
    ];
    const expected = [
      {
        comments: 'some comments',
        date: 'December 15, 2021',
        heartRate: 90,
        time: '0940',
      },
    ];
    expect(convertVitalsHeartRate(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        heartRate: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsHeartRate(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsHeartRate([])).to.deep.equal([]);
  });
});

describe('convertVitalsInr', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '12:30',
        inr: 2.8,
        lowendTargetRange: 'METR',
        highendTragetRange: 'METR',
        location: 'Location value',
        provider: 'Provider value',
        comments: 'Some comments',
      },
    ];
    const expected = [
      {
        comments: 'Some comments',
        date: 'December 15, 2021',
        highendTargetRange: '3.5',
        inrValue: 2.8,
        location: 'Location value',
        lowendTargetRange: '2.0',
        provider: 'Provider value',
        time: '1230',
      },
    ];
    expect(convertVitalsInr(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        highendTargetRange: NONE_ENTERED,
        inrValue: NONE_ENTERED,
        location: NONE_ENTERED,
        lowendTargetRange: NONE_ENTERED,
        provider: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsInr(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsInr([])).to.deep.equal([]);
  });
});

describe('convertVitalsPain', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '12:20',
        comments: 'Some comments',
        painLevel: 5,
      },
    ];
    const expected = [
      {
        comments: 'Some comments',
        date: 'December 15, 2021',
        painLevel: 5,
        time: '1220',
      },
    ];
    expect(convertVitalsPain(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        painLevel: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsPain(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsPain([])).to.deep.equal([]);
  });
});

describe('convertVitalsPulseOx', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dateEntered: '12/15/2021',
        timeEntered: '13:20',
        comments: 'Some comments',
        suppOxygenDevice: 'OH',
        oxygenSetting: 2,
        respiratoryRate: 18,
        oximeterReading: 95,
        otherSymptoms: 'Some symptoms',
        symptoms: 'C',
      },
    ];
    const expected = [
      {
        comments: 'Some comments',
        date: 'December 15, 2021',
        otherSymptoms: 'Some symptoms',
        oximeterReading: 95,
        oxygenSetting: 2,
        respiratoryRate: 18,
        supplementalOxygenDevice: 'Oxygen Hood',
        symptoms: 'Confusion',
        time: '1320',
      },
    ];
    expect(convertVitalsPulseOx(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        otherSymptoms: NONE_ENTERED,
        oximeterReading: NONE_ENTERED,
        oxygenSetting: NONE_ENTERED,
        respiratoryRate: NONE_ENTERED,
        supplementalOxygenDevice: NONE_ENTERED,
        symptoms: NONE_ENTERED,
        time: NONE_ENTERED,
      },
    ];
    expect(convertVitalsPulseOx(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertVitalsPulseOx([])).to.deep.equal([]);
  });
});

describe('convertVitals', () => {
  it('should correctly handle a full response', () => {
    const result = convertVitals(seiVitals);
    expect(result.bloodPressure.length).to.eq(5);
    expect(result.bloodSugar.length).to.eq(5);
    expect(result.bodyTemperature.length).to.eq(5);
    expect(result.bodyWeight.length).to.eq(5);
    expect(result.cholesterol.length).to.eq(5);
    expect(result.heartRate.length).to.eq(5);
    expect(result.inr.length).to.eq(5);
    expect(result.pain.length).to.eq(5);
    expect(result.pulseOximetry.length).to.eq(5);
  });

  it('should correctly handle null input', () => {
    expect(convertVitals(null)).to.be.null;
  });
});

describe('convertAllergies', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          allergiesId: 16956740,
          comments: 'some comments',
          allergy: 'pollen Allergy',
          eventDate: '2020-04-03',
          reaction: 'runny nose, red eyes',
          diagnosed: 'Y',
          severity: 'S',
          userprofileId: 15176497,
          source: 'Self',
        },
      ],
    };
    const expected = [
      {
        allergyName: 'pollen Allergy',
        comments: 'some comments',
        date: 'April 3, 2020',
        diagnosed: 'Yes',
        reaction: 'runny nose, red eyes',
        severity: 'Severe',
      },
    ];
    expect(convertAllergies(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = { pojoObject: [{}] };
    const expected = [
      {
        allergyName: NONE_ENTERED,
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        diagnosed: NONE_ENTERED,
        reaction: NONE_ENTERED,
        severity: NONE_ENTERED,
      },
    ];
    expect(convertAllergies(input)).to.deep.equal(expected);
  });

  it('should return an empty array when the input is an empty array', () => {
    expect(convertAllergies({ pojoObject: [] })).to.deep.equal([]);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertAllergies({ pojoObject: null })).to.be.null;
    expect(convertAllergies({})).to.be.null;
  });
});
