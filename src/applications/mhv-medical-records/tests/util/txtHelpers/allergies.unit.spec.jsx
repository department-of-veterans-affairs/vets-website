import { expect } from 'chai';
import { parseAllergies } from '../../../util/txtHelpers/allergies';

describe('parseAllergies', () => {
  it('should return default text when no records are provided', () => {
    const result = parseAllergies([]);
    expect(result).to.include('4) Allergies');
    expect(result).to.include(
      'If you have allergies that are missing from this list, send a secure message to your care team.',
    );
  });

  it('should process records with all fields populated correctly', () => {
    const records = [
      {
        name: 'Peanut Allergy',
        date: '2021-01-01',
        reaction: ['Hives', 'Swelling'],
        type: 'Food',
        location: 'Home',
        observedOrReported: 'Observed',
        notes: 'Severe reaction',
      },
    ];
    const result = parseAllergies(records);
    expect(result).to.include('Peanut Allergy');
    expect(result).to.include('Date entered: 2021-01-01');
    expect(result).to.include('Signs and symptoms: Hives, Swelling');
    expect(result).to.include('Type of allergy: Food');
    expect(result).to.include('Location: Home');
    expect(result).to.include('Observed or historical: Observed');
    expect(result).to.include('Provider notes: Severe reaction');
  });

  it('should handle records with missing fields gracefully', () => {
    const records = [
      {
        name: 'Dust Allergy',
        date: '2020-05-15',
        reaction: ['Sneezing'],
        type: 'Environmental',
        location: '',
        observedOrReported: 'Reported',
        notes: '',
      },
    ];
    const result = parseAllergies(records);
    expect(result).to.include('Dust Allergy');
    expect(result).to.include('Date entered: 2020-05-15');
    expect(result).to.include('Signs and symptoms: Sneezing');
    expect(result).to.include('Type of allergy: Environmental');
    expect(result).to.include('Location: ');
    expect(result).to.include('Observed or historical: Reported');
    expect(result).to.include('Provider notes: ');
  });
});
