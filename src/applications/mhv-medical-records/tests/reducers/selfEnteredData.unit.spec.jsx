import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  convertActivityJournal,
  convertAllergies,
  convertDemographics,
  convertEmergencyContacts,
  convertFamilyHealthHistory,
  convertFoodJournal,
  convertHealthcareProviders,
  convertHealthInsurance,
  convertLabsAndTests,
  convertMedicalEvents,
  convertMedications,
  convertMilitaryHistory,
  convertTreatmentFacilities,
  convertVaccines,
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
  formatDayOfWeek,
  formatTime,
  formatTimestamp,
  mapValue,
  NONE_ENTERED,
  selfEnteredReducer,
  sortDesc,
} from '../../reducers/selfEnteredData';
import { selfEnteredTypes } from '../../util/constants';
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

describe('formatDayOfWeek', () => {
  it('should return the correct day of the week for a valid date', () => {
    expect(formatDayOfWeek('01/01/2024')).to.eq('Monday');
    expect(formatDayOfWeek('12/25/2024')).to.eq('Wednesday');
    expect(formatDayOfWeek('07/04/2024')).to.eq('Thursday');
  });

  it('should handle leap years correctly', () => {
    expect(formatDayOfWeek('02/29/2020')).to.eq('Saturday');
    expect(formatDayOfWeek('02/29/2024')).to.eq('Thursday');
  });

  it('should return null for an invalid date', () => {
    expect(formatDayOfWeek('00/00/2024')).to.be.null;
  });

  it('should return null for an empty or null input', () => {
    expect(formatDayOfWeek('')).to.be.null;
    expect(formatDayOfWeek(null)).to.be.null;
    expect(formatDayOfWeek(undefined)).to.be.null;
  });

  it('should handle single-digit month and day correctly', () => {
    expect(formatDayOfWeek('7/4/2024')).to.eq('Thursday');
    expect(formatDayOfWeek('9/1/2024')).to.eq('Sunday');
  });

  it('should handle invalid formats gracefully', () => {
    expect(formatDayOfWeek('2024-07-04')).to.be.null; // Incorrect format
    expect(formatDayOfWeek('July 4, 2024')).to.be.null; // Incorrect format
    expect(formatDayOfWeek('04/07/')).to.be.null; // Missing year
    expect(formatDayOfWeek('')).to.be.null; // Empty string
    expect(formatDayOfWeek('07')).to.be.null; // Only month provided
  });

  it('should handle edge case years', () => {
    expect(formatDayOfWeek('01/01/1900')).to.eq('Monday');
    expect(formatDayOfWeek('12/31/9999')).to.eq('Friday');
  });

  it('should return null for non-numeric input', () => {
    expect(formatDayOfWeek('MM/DD/YYYY')).to.be.null; // Placeholder format
    expect(formatDayOfWeek('abc/def/ghi')).to.be.null; // Non-numeric string
  });
});

describe('sortDesc', () => {
  it('should sort numbers', () => {
    const data = [{ key: 2 }, { key: 3 }, { key: null }, { key: 1 }];

    const sorted = data.sort(sortDesc('key'));
    const expectedValues = [3, 2, 1, null];
    expectedValues.forEach((value, index) => {
      expect(sorted[index].key).to.eq(value);
    });
  });

  it('should sort strings', () => {
    const data = [{ key: '2' }, { key: '3' }, { key: null }, { key: '1' }];

    const sorted = data.sort(sortDesc('key'));
    const expectedValues = ['3', '2', '1', null];
    expectedValues.forEach((value, index) => {
      expect(sorted[index].key).to.eq(value);
    });
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
        sort: undefined,
      },
    ];
    expect(convertVitalsBloodPressure(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsBloodPressure(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsBloodSugar(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsBloodSugar(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsBodyTemp(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsBodyTemp(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsBodyWeight(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsBodyWeight(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsCholesterol(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsCholesterol(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsHeartRate(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsHeartRate(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        heartRate: NONE_ENTERED,
        time: NONE_ENTERED,
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsInr(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsInr(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsPain(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsPain(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        comments: NONE_ENTERED,
        date: NONE_ENTERED,
        painLevel: NONE_ENTERED,
        time: NONE_ENTERED,
        sort: undefined,
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
        sort: undefined,
      },
    ];
    expect(convertVitalsPulseOx(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = [
      { comments: 1, reading: 1600000000000 },
      { comments: 2, reading: null },
      { comments: 3, reading: 1700000000000 },
    ];
    const list = convertVitalsPulseOx(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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
        sort: '2020-04-03',
      },
    ];
    expect(convertAllergies(input)).to.deep.equal(expected);
  });

  it('should be sorted reverse chronologically', () => {
    const input = {
      pojoObject: [
        { comments: 1, eventDate: '2021-01-01' },
        { comments: 2, eventDate: null },
        { comments: 3, eventDate: '2022-02-02' },
      ],
    };
    const list = convertAllergies(input);
    const expectedValues = [3, 1, 2];
    expectedValues.forEach((value, index) => {
      expect(list[index].comments).to.eq(value);
    });
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
        sort: undefined,
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

describe('convertFamilyHealthHistory', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          relationship: 'M',
          firstName: 'Jane',
          lastName: 'Doe',
          living: false,
          slInsomnia: true,
          kiStones: true,
          comments: 'Family health issue comments',
        },
      ],
    };
    const expected = [
      {
        relationship: 'Mother',
        firstName: 'Jane',
        lastName: 'Doe',
        livingOrDeceased: 'Deceased',
        healthIssues: 'Insomnia, Kidney Stones',
        otherHealthIssues: NONE_ENTERED,
        comments: 'Family health issue comments',
      },
    ];
    expect(convertFamilyHealthHistory(input)).to.deep.equal(expected);
  });

  it('should return a single health issue without a comma', () => {
    const input = { pojoObject: [{ slInsomnia: true }] };
    expect(convertFamilyHealthHistory(input)[0].healthIssues).to.eq('Insomnia');
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = { pojoObject: [{}] };
    const expected = [
      {
        relationship: NONE_ENTERED,
        firstName: NONE_ENTERED,
        lastName: NONE_ENTERED,
        livingOrDeceased: NONE_ENTERED,
        healthIssues: NONE_ENTERED,
        otherHealthIssues: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertFamilyHealthHistory(input)).to.deep.equal(expected);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertFamilyHealthHistory({ pojoObject: null })).to.be.null;
    expect(convertFamilyHealthHistory({})).to.be.null;
  });
});

describe('convertVaccines', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          vaccinationTypeCode: 'FLU',
          otherVaccine: 'another vaccine',
          vaccinationMethod: 'J',
          dateReceived: '2022-06-29',
          reactionTypeCode: 'ST',
          reactions: [{ reactionTypeCode: 'HLS' }, { reactionTypeCode: 'RSH' }],
          comments: 'Flu vaccine comments',
        },
      ],
    };
    const expected = [
      {
        vaccine: 'Flu (influenza)',
        other: 'another vaccine',
        method: 'Injection',
        dateReceived: 'June 29, 2022',
        reactions: 'Chills, Rash',
        comments: 'Flu vaccine comments',
        sort: '2022-06-29',
      },
    ];
    expect(convertVaccines(input)).to.deep.equal(expected);
  });

  it('should return a single reaction without a comma', () => {
    const input = {
      pojoObject: [{ reactions: [{ reactionTypeCode: 'HLS' }] }],
    };
    expect(convertVaccines(input)[0].reactions).to.eq('Chills');
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = { pojoObject: [{}] };
    const expected = [
      {
        vaccine: NONE_ENTERED,
        other: NONE_ENTERED,
        method: NONE_ENTERED,
        dateReceived: NONE_ENTERED,
        reactions: NONE_ENTERED,
        comments: NONE_ENTERED,
        sort: undefined,
      },
    ];
    expect(convertVaccines(input)).to.deep.equal(expected);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertVaccines({ pojoObject: null })).to.be.null;
    expect(convertVaccines({})).to.be.null;
  });
});

describe('convertLabsAndTests', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          testName: 'Blood Test',
          eventDate: '2020-11-10',
          locationPerformed: 'Test Lab',
          provider: 'Dr. Smith',
          results: 'Normal',
          comments: 'Routine test',
        },
      ],
    };
    const expected = [
      {
        testName: 'Blood Test',
        date: 'November 10, 2020',
        locationPerformed: 'Test Lab',
        provider: 'Dr. Smith',
        results: 'Normal',
        comments: 'Routine test',
      },
    ];
    expect(convertLabsAndTests(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = { pojoObject: [{}] };
    const expected = [
      {
        testName: NONE_ENTERED,
        date: NONE_ENTERED,
        locationPerformed: NONE_ENTERED,
        provider: NONE_ENTERED,
        results: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertLabsAndTests(input)).to.deep.equal(expected);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertLabsAndTests({ pojoObject: null })).to.be.null;
    expect(convertLabsAndTests({})).to.be.null;
  });
});

describe('convertMedicalEvents', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          medicalEvent: 'Surgery',
          startDate: '2020-04-14T23:59:00',
          stopDate: '2020-04-29T23:59:00',
          response: 'Successful',
          comments: 'Major surgery performed',
        },
      ],
    };
    const expected = [
      {
        medicalEvent: 'Surgery',
        startDate: 'April 14, 2020',
        stopDate: 'April 29, 2020',
        response: 'Successful',
        comments: 'Major surgery performed',
      },
    ];
    expect(convertMedicalEvents(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = { pojoObject: [{}] };
    const expected = [
      {
        medicalEvent: NONE_ENTERED,
        startDate: NONE_ENTERED,
        stopDate: NONE_ENTERED,
        response: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertMedicalEvents(input)).to.deep.equal(expected);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertMedicalEvents({ pojoObject: null })).to.be.null;
    expect(convertMedicalEvents({})).to.be.null;
  });
});

describe('convertMilitaryHistory', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = {
      pojoObject: [
        {
          eventTitle: 'Deployment to Iraq',
          eventDate: '2020-11-10',
          serviceBranch: 'A',
          aboardShip: 'Y',
          rank: 'Sergeant',
          exposures: 'Burn pits',
          serviceLocation: 'O',
          occupationSpecialty: 'Infantry',
          serviceAssignment: 'Combat Operations',
          experience: 'Testing',
        },
      ],
    };
    const expected = [
      {
        eventTitle: 'Deployment to Iraq',
        eventDate: 'November 10, 2020',
        serviceBranch: 'Army',
        onboardShip: 'Yes',
        rank: 'Sergeant',
        exposuresExist: 'Yes',
        locationOfService: 'Overseas',
        militaryOccupationalSpecialty: 'Infantry',
        assignment: 'Combat Operations',
        exposures: 'Burn pits',
        militaryServiceExperience: 'Testing',
      },
    ];
    expect(convertMilitaryHistory(input)).to.deep.equal(expected);
  });

  it('should handle missing or null fields gracefully', () => {
    const input = {
      pojoObject: [{}],
    };
    const expected = [
      {
        eventTitle: NONE_ENTERED,
        eventDate: NONE_ENTERED,
        serviceBranch: NONE_ENTERED,
        onboardShip: NONE_ENTERED,
        rank: NONE_ENTERED,
        exposuresExist: 'No',
        locationOfService: NONE_ENTERED,
        militaryOccupationalSpecialty: NONE_ENTERED,
        assignment: NONE_ENTERED,
        exposures: NONE_ENTERED,
        militaryServiceExperience: NONE_ENTERED,
      },
    ];
    expect(convertMilitaryHistory(input)).to.deep.equal(expected);
  });

  it('should return null when pojoObject is null or missing', () => {
    expect(convertMilitaryHistory({ pojoObject: null })).to.be.null;
    expect(convertMilitaryHistory({})).to.be.null;
  });
});

describe('convertHealthcareProviders', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        firstName: 'John',
        lastName: 'Doe',
        providerType: 'P',
        otherClinician: 'General Practitioner',
        workPhone: '123-456-7890',
        workPhoneExt: '101',
        emailAddress: 'johndoe@example.com',
        comments: 'Family doctor',
      },
    ];
    const expected = [
      {
        providerName: 'John Doe',
        typeOfProvider: 'Primary',
        otherClinicianInformation: 'General Practitioner',
        phoneNumber: '123-456-7890 Ext: 101',
        email: 'johndoe@example.com',
        comments: 'Family doctor',
      },
    ];
    expect(convertHealthcareProviders(input)).to.deep.equal(expected);
  });

  it('handles partial names', () => {
    expect(
      convertHealthcareProviders([{ firstName: 'John' }])[0].providerName,
    ).to.eq('John');
    expect(
      convertHealthcareProviders([{ lastName: 'Doe' }])[0].providerName,
    ).to.eq('Doe');
  });

  it('handles partial phone numbers', () => {
    expect(
      convertHealthcareProviders([{ workPhone: '123-456-7890' }])[0]
        .phoneNumber,
    ).to.eq('123-456-7890 Ext:');
    expect(
      convertHealthcareProviders([{ workPhoneExt: '101' }])[0].phoneNumber,
    ).to.eq(NONE_ENTERED);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        providerName: NONE_ENTERED,
        typeOfProvider: NONE_ENTERED,
        otherClinicianInformation: NONE_ENTERED,
        phoneNumber: NONE_ENTERED,
        email: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertHealthcareProviders(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertHealthcareProviders(null)).to.be.null;
    expect(convertHealthcareProviders([])).to.deep.equal([]);
  });
});

describe('convertHealthInsurance', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        companyName: 'HealthCo',
        primaryInd: true,
        insuranceIdNumber: '12345',
        groupNumber: '67890',
        firstNameOfInsured: 'Jane',
        lastNameOfInsured: 'Doe',
        startDate: 1610125200000,
        stopDate: 1620057600000,
        preApprovalPhone: '123-456-7890',
        companyPhone: '987-654-3210',
        comments: 'Health insurance details',
      },
    ];
    const expected = [
      {
        healthInsuranceCompany: 'HealthCo',
        primaryInsuranceProvider: 'Yes',
        idNumber: '12345',
        groupNumber: '67890',
        insured: 'Jane Doe',
        startDate: 'January 8, 2021',
        stopDate: 'May 3, 2021',
        preApprovalPhoneNumber: '123-456-7890',
        healthInsCoPhoneNumber: '987-654-3210',
        comments: 'Health insurance details',
      },
    ];
    expect(convertHealthInsurance(input)).to.deep.equal(expected);
  });

  it('handles partial names', () => {
    expect(
      convertHealthInsurance([{ firstNameOfInsured: 'Jane' }])[0].insured,
    ).to.eq('Jane');
    expect(
      convertHealthInsurance([{ lastNameOfInsured: 'Doe' }])[0].insured,
    ).to.eq('Doe');
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        healthInsuranceCompany: NONE_ENTERED,
        primaryInsuranceProvider: NONE_ENTERED,
        idNumber: NONE_ENTERED,
        groupNumber: NONE_ENTERED,
        insured: NONE_ENTERED,
        startDate: NONE_ENTERED,
        stopDate: NONE_ENTERED,
        preApprovalPhoneNumber: NONE_ENTERED,
        healthInsCoPhoneNumber: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertHealthInsurance(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertHealthInsurance(null)).to.be.null;
    expect(convertHealthInsurance([])).to.deep.equal([]);
  });
});

describe('convertTreatmentFacilities', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        facilityName: 'VA Hospital',
        facilityType: 'V',
        homeFacility: true,
        contactInfoWorkPhone: '123-456-7890',
        contactInfoWorkPhoneExt: '101',
        contactInfoFax: '123-456-7891',
        addressStreet1: '123 Main St',
        addressStreet2: 'Apt 4',
        addressCity: 'Some City',
        addressState: 'MD',
        addressCountry: 'USA',
        addressPostalCode: '12345',
        comments: 'Great facility',
      },
    ];
    const expected = [
      {
        facilityName: 'VA Hospital',
        facilityType: 'VA',
        vaHomeFacility: 'Yes',
        phoneNumber: '123-456-7890 Ext: 101',
        faxNumber: '123-456-7891',
        mailingAddress: '123 Main St, Apt 4, Some City, MD, USA, 12345',
        comments: 'Great facility',
      },
    ];
    expect(convertTreatmentFacilities(input)).to.deep.equal(expected);
  });

  it('handles partial phone numbers', () => {
    expect(
      convertTreatmentFacilities([{ contactInfoWorkPhone: '123-456-7890' }])[0]
        .phoneNumber,
    ).to.eq('123-456-7890 Ext:');
    expect(
      convertTreatmentFacilities([{ contactInfoWorkPhoneExt: '101' }])[0]
        .phoneNumber,
    ).to.eq(NONE_ENTERED);
  });

  it('should return a single address part without a comma', () => {
    const input = [{ addressCity: 'Some City' }];
    expect(convertTreatmentFacilities(input)[0].mailingAddress).to.eq(
      'Some City',
    );
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        facilityName: NONE_ENTERED,
        facilityType: NONE_ENTERED,
        vaHomeFacility: NONE_ENTERED,
        phoneNumber: NONE_ENTERED,
        faxNumber: NONE_ENTERED,
        mailingAddress: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertTreatmentFacilities(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertTreatmentFacilities(null)).to.be.null;
    expect(convertTreatmentFacilities([])).to.deep.equal([]);
  });
});

describe('convertFoodJournal', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dispJournalDate: '07/24/2024',
        glassesOfWater: 8,
        breakFastMealItems: [
          {
            item: 'Eggs',
            quantity: 2,
            servingSize: 'large',
            prepMethod: 'Scrambled',
          },
        ],
        lunchMealItems: [
          {
            item: 'Sandwich',
            quantity: 1,
            servingSize: 'medium',
            prepMethod: 'Grilled',
          },
        ],
        comments: 'Healthy meals',
      },
    ];
    const expected = [
      {
        date: 'July 24, 2024',
        dayOfWeek: 'Wednesday',
        waterConsumed: 8,
        breakfastItems: [
          {
            item: 'Eggs',
            quantity: 2,
            servingSize: 'large',
            methodOfPreparation: 'Scrambled',
          },
        ],
        lunchItems: [
          {
            item: 'Sandwich',
            quantity: 1,
            servingSize: 'medium',
            methodOfPreparation: 'Grilled',
          },
        ],
        dinnerItems: [],
        snackItems: [],
        comments: 'Healthy meals',
      },
    ];
    expect(convertFoodJournal(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        date: NONE_ENTERED,
        dayOfWeek: NONE_ENTERED,
        waterConsumed: 0,
        breakfastItems: [],
        lunchItems: [],
        dinnerItems: [],
        snackItems: [],
        comments: NONE_ENTERED,
      },
    ];
    expect(convertFoodJournal(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertFoodJournal(null)).to.be.null;
    expect(convertFoodJournal([])).to.deep.equal([]);
  });
});

describe('convertActivityJournal', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dispJournalDate: '7/4/2024',
        comments: 'Great workout',
        activityDetails: [
          {
            description: 'Running',
            activityType: 'A',
            dispMeasure: 'Min(s)',
            dispIntensity: 'Moderate impact',
            distanceDuration: 30,
            setCount: 0,
            repCount: 0,
            dispTimeOfDay: 'Afternoon',
          },
        ],
      },
    ];
    const expected = [
      {
        date: 'July 4, 2024',
        dayOfWeek: 'Thursday',
        comments: 'Great workout',
        activities: [
          {
            activity: 'Running',
            type: 'Aerobic/Cardio',
            distanceDuration: 30,
            measure: 'Min(s)',
            intensity: 'Moderate impact',
            numberOfSets: 0,
            numberOfReps: 0,
            timeOfDay: 'Afternoon',
          },
        ],
      },
    ];
    expect(convertActivityJournal(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        date: NONE_ENTERED,
        dayOfWeek: NONE_ENTERED,
        comments: NONE_ENTERED,
        activities: [],
      },
    ];
    expect(convertActivityJournal(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertActivityJournal(null)).to.be.null;
    expect(convertActivityJournal([])).to.deep.equal([]);
  });
});

describe('convertMedications', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        dispCategory: 'Chronic',
        medicationName: 'Lisinopril',
        prescriptionNumber: 'RX12345',
        strength: '10 mg',
        dosage: '1 tablet',
        frequency: 'Once daily',
        dispStartDate: '7/1/2024',
        dispEndDate: '7/31/2024',
        pharmacyName: 'Pharmacy Co.',
        pharmacyPhone: '123-456-7890',
        reason: 'High blood pressure',
        comments: 'Take with food',
      },
    ];
    const expected = [
      {
        category: 'Chronic',
        drugName: 'Lisinopril',
        prescriptionNumber: 'RX12345',
        strength: '10 mg',
        dose: '1 tablet',
        frequency: 'Once daily',
        startDate: 'July 1, 2024',
        stopDate: 'July 31, 2024',
        pharmacyName: 'Pharmacy Co.',
        pharmacyPhone: '123-456-7890',
        reasonForTaking: 'High blood pressure',
        comments: 'Take with food',
      },
    ];
    expect(convertMedications(input)).to.deep.equal(expected);
  });

  it('should return an object with "Not Entered" for empty values', () => {
    const input = [{}];
    const expected = [
      {
        category: NONE_ENTERED,
        drugName: NONE_ENTERED,
        prescriptionNumber: NONE_ENTERED,
        strength: NONE_ENTERED,
        dose: NONE_ENTERED,
        frequency: NONE_ENTERED,
        startDate: NONE_ENTERED,
        stopDate: NONE_ENTERED,
        pharmacyName: NONE_ENTERED,
        pharmacyPhone: NONE_ENTERED,
        reasonForTaking: NONE_ENTERED,
        comments: NONE_ENTERED,
      },
    ];
    expect(convertMedications(input)).to.deep.equal(expected);
  });

  it('should return null for an empty or invalid input', () => {
    expect(convertMedications(null)).to.be.null;
    expect(convertMedications([])).to.deep.equal([]);
  });
});

describe('selfEnteredReducer', () => {
  it('adds failed domains', () => {
    let newState = selfEnteredReducer(
      { failedDomains: [] },
      {
        type: Actions.SelfEntered.ADD_FAILED,
        payload: selfEnteredTypes.VITALS,
      },
    );

    expect(newState.failedDomains.length).to.equal(1);
    expect(newState.failedDomains[0]).to.equal(selfEnteredTypes.VITALS);

    // Adding a different failed domain
    newState = selfEnteredReducer(newState, {
      type: Actions.SelfEntered.ADD_FAILED,
      payload: selfEnteredTypes.ALLERGIES,
    });

    expect(newState.failedDomains.length).to.equal(2);
    expect(newState.failedDomains[1]).to.equal(selfEnteredTypes.ALLERGIES);
  });

  it('does not add a duplicate failed domain', () => {
    const initialState = { failedDomains: [selfEnteredTypes.VITALS] };
    const newState = selfEnteredReducer(initialState, {
      type: Actions.SelfEntered.ADD_FAILED,
      payload: selfEnteredTypes.VITALS,
    });

    // The failedDomains array should remain unchanged
    expect(newState.failedDomains.length).to.equal(1);
    expect(newState.failedDomains[0]).to.equal(selfEnteredTypes.VITALS);
  });

  it('clears failed domains', () => {
    const initialState = {
      failedDomains: [selfEnteredTypes.VITALS, selfEnteredTypes.ALLERGIES],
    };
    const newState = selfEnteredReducer(initialState, {
      type: Actions.SelfEntered.CLEAR_FAILED,
    });

    expect(newState.failedDomains.length).to.equal(0);
  });
});

describe('convertDemographics', () => {
  it('should return a correctly transformed object for valid input', () => {
    const input = {
      userProfile: {
        name: {
          firstName: 'John',
          middleName: 'A',
          lastName: 'Doe',
          alias: 'JD',
        },
        birthDate: '1985-06-15T00:00:00Z',
        gender: 'Male',
        bloodType: 'O+',
        isOrganDonor: true,
        maritalStatus: 'Single',
        isPatient: true,
        isVeteran: false,
        isCaregiver: false,
        isPatientAdvocate: true,
        isHealthCareProvider: false,
        isServiceMember: false,
        isOther: true,
        currentOccupation: 'Engineer',
        contact: {
          homePhone: '555-1234',
          workPhone: '555-5678',
          pager: '555-9999',
          mobilePhone: '555-4321',
          fax: '555-1111',
          email: 'john@example.com',
          contactMethod: 'Email',
        },
        address: {
          address1: '123 Main St',
          city: 'Somewhere',
          state: 'CA',
          zip: '90210',
          country: 'USA',
        },
      },
    };

    const result = convertDemographics(input);
    expect(result.firstName).to.eq('John');
    expect(result.middleName).to.eq('A');
    expect(result.lastName).to.eq('Doe');
    expect(result.alias).to.eq('JD');
    expect(result.dateOfBirth).to.eq('1985-06-15');
    expect(result.gender).to.eq('Male');
    expect(result.bloodType).to.eq('O+');
    expect(result.organDonor).to.eq(true);
    expect(result.maritalStatus).to.eq('Single');
    expect(result.relationshipToVA).to.deep.equal([
      'Patient',
      'Advocate',
      'Other',
    ]);
    expect(result.occupation).to.eq('Engineer');
    expect(result.contactInfo.homePhone).to.eq('555-1234');
    expect(result.contactInfo.email).to.eq('john@example.com');
    expect(result.address.city).to.eq('Somewhere');
  });

  it('should return null when input is null', () => {
    expect(convertDemographics(null)).to.be.null;
  });
});

describe('convertEmergencyContacts', () => {
  it('should return a correctly transformed array for valid input', () => {
    const input = [
      {
        firstName: 'Jane',
        lastName: 'Smith',
        relationship: 'Sister',
        contactInfoHomePhone: '111-1111',
        contactInfoWorkPhone: '222-2222',
        contactInfoMobilePhone: '333-3333',
        contactInfoEmail: 'jane@example.com',
        addressStreet1: '456 Maple St',
        addressCity: 'Anywhere',
        addressState: 'NY',
        addressPostalCode: '10001',
        addressCountry: 'USA',
      },
    ];

    const result = convertEmergencyContacts(input);
    expect(result)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(result[0].firstName).to.eq('Jane');
    expect(result[0].lastName).to.eq('Smith');
    expect(result[0].relationship).to.eq('Sister');
    expect(result[0].homePhone).to.eq('111-1111');
    expect(result[0].address.city).to.eq('Anywhere');
  });

  it('should return null when input is null', () => {
    expect(convertEmergencyContacts(null)).to.be.null;
  });
});
