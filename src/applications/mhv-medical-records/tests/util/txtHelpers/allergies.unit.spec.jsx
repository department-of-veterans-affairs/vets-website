import { expect } from 'chai';
import { parseAllergies } from '../../../util/txtHelpers/allergies';

describe('parseAllergies', () => {
  it('should return default text when no records are provided', () => {
    const result = parseAllergies([]);
    expect(result).to.include('4) Allergies');
    expect(result).to.include(
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your\nallergies and reactions (including any reactions to vaccines), download your allergy records.\n\nShowing 0 records from newest to oldest\n\n\n',
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

  it('should handle null/undefined records and reaction fields without crashing', () => {
    // Test undefined records
    expect(() => parseAllergies(undefined)).to.not.throw();
    expect(() => parseAllergies(null)).to.not.throw();

    // Test record with undefined reaction
    const recordWithNoReaction = [{ name: 'Test Allergy', date: '2021-01-01' }];
    expect(() => parseAllergies(recordWithNoReaction)).to.not.throw();
    const result = parseAllergies(recordWithNoReaction);
    expect(result).to.include('Signs and symptoms:');
  });

  it('should handle records with all undefined field values', () => {
    const records = [
      {
        name: undefined,
        date: undefined,
        reaction: undefined,
        type: undefined,
        location: undefined,
        observedOrReported: undefined,
        notes: undefined,
      },
    ];
    expect(() => parseAllergies(records)).to.not.throw();
    const result = parseAllergies(records);
    expect(result).to.include('Date entered: undefined');
    expect(result).to.include('Signs and symptoms:');
    expect(result).to.include('Type of allergy: undefined');
  });

  it('should handle records with partially missing properties', () => {
    const records = [
      {
        name: 'Partial Allergy',
        // date, type, location, observedOrReported, notes are missing
        reaction: ['Rash'],
      },
    ];
    expect(() => parseAllergies(records)).to.not.throw();
    const result = parseAllergies(records);
    expect(result).to.include('Partial Allergy');
    expect(result).to.include('Signs and symptoms: Rash');
    expect(result).to.include('Date entered: undefined');
  });

  it('should handle empty reaction array', () => {
    const records = [
      {
        name: 'No Reaction Allergy',
        date: '2021-01-01',
        reaction: [],
        type: 'Drug',
        location: 'Clinic',
        observedOrReported: 'Reported',
        notes: 'None',
      },
    ];
    expect(() => parseAllergies(records)).to.not.throw();
    const result = parseAllergies(records);
    expect(result).to.include('Signs and symptoms: ');
  });
});
