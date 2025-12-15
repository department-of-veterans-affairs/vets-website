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
});
