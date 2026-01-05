import { expect } from 'chai';
import { parseVitals } from '../../../util/txtHelpers/vitals';

describe('parseVitals', () => {
  it('should correctly pull the date from the date field in vitals records', () => {
    const vitalsRecords = [
      {
        type: 'PULSE',
        date: '2025-08-25',
        measurement: '72 bpm',
        location: 'Clinic A',
        notes: 'Normal',
      },
      {
        type: 'RESPIRATION',
        date: '2025-08-24',
        measurement: '16 breaths/min',
        location: 'Clinic B',
        notes: 'Normal',
      },
    ];
    const result = parseVitals(vitalsRecords);
    expect(result).to.contain('2025-08-25');
    expect(result).to.contain('2025-08-24');
    expect(result).to.contain('72 bpm');
    expect(result).to.contain('16 breaths/min');
  });

  it('should handle null/undefined records without crashing', () => {
    expect(() => parseVitals(undefined)).to.not.throw();
    expect(() => parseVitals(null)).to.not.throw();
    const result = parseVitals(null);
    expect(result).to.include('Vitals');
  });

  it('should handle records with missing type property', () => {
    const vitalsRecords = [
      { date: '2025-08-25', measurement: '72 bpm' },
      { type: 'PULSE', date: '2025-08-24', measurement: '68 bpm' },
    ];
    expect(() => parseVitals(vitalsRecords)).to.not.throw();
    const result = parseVitals(vitalsRecords);
    expect(result).to.include('Heart rate');
  });

  it('should handle records with undefined field values', () => {
    const vitalsRecords = [
      {
        type: 'PULSE',
        date: undefined,
        measurement: undefined,
        location: undefined,
        notes: undefined,
      },
    ];
    expect(() => parseVitals(vitalsRecords)).to.not.throw();
    const result = parseVitals(vitalsRecords);
    expect(result).to.include('Heart rate');
    expect(result).to.include('Result: undefined');
  });

  it('should handle empty records array', () => {
    expect(() => parseVitals([])).to.not.throw();
    const result = parseVitals([]);
    expect(result).to.include('Vitals');
  });
});
