import { expect } from 'chai';
import {
  convertVaccine,
  extractNote,
  extractReaction,
  extractLocation,
} from '../../reducers/vaccines';

describe('vaccine reducer', () => {
  it('convertVaccine function should return null if it is not passed an argument', () => {
    expect(convertVaccine()).to.eq(null);
  });
});

describe('extractNote function', () => {
  it('should return empty list when vaccine has no notes', () => {
    const vaccine = {
      note: [],
    };

    const result = extractNote(vaccine);

    expect(result).to.deep.equal([]);
  });

  it('should return an array of notes when vaccine has valid notes', () => {
    const vaccine = {
      note: [{ text: 'Note 1' }, { text: 'Note 2' }, { text: 'Note 3' }],
    };

    const result = extractNote(vaccine);

    expect(result).to.deep.equal(['Note 1', 'Note 2', 'Note 3']);
  });
});

describe('extractReaction', () => {
  it('should extract reaction from contained Observation', () => {
    // Sample vaccine object with contained Observation
    const vaccineWithObservation = {
      contained: [
        {
          resourceType: 'Observation',
          code: {
            text: 'Sample Reaction',
          },
        },
      ],
    };

    const result = extractReaction(vaccineWithObservation);

    expect(result).equal('Sample Reaction');
  });

  it('should return None noted if no contained Observation', () => {
    // Sample vaccine object without contained Observation
    const vaccineWithoutObservation = {
      contained: [],
    };

    const result = extractReaction(vaccineWithoutObservation);

    expect(result).to.eq('None noted');
  });

  it('should return None noted if contained Observation has no code.text', () => {
    // Sample vaccine object with contained Observation but no code.text
    const vaccineWithObservationNoCodeText = {
      contained: [
        {
          resourceType: 'Observation',
          code: {},
        },
      ],
    };

    const result = extractReaction(vaccineWithObservationNoCodeText);

    expect(result).to.eq('None noted');
  });

  it('should return None noted if no contained resources', () => {
    // Sample vaccine object with empty contained array
    const vaccineWithEmptyContained = {
      contained: [],
    };

    const result = extractReaction(vaccineWithEmptyContained);

    expect(result).to.eq('None noted');
  });
});

describe('extractLocation function', () => {
  it('should return an empty field when vaccine has no location data', () => {
    const vaccine = {};

    const result = extractLocation(vaccine);

    expect(result).to.equal('None noted');
  });

  it('should return the location name when vaccine has valid location data', () => {
    const vaccine = {
      location: {
        reference: '#in-location-2',
      },
      contained: [
        {
          resourceType: 'Location',
          id: 'in-location-2',
          name: 'ADTP BURNETT',
        },
      ],
    };

    const result = extractLocation(vaccine);

    expect(result).to.equal('ADTP BURNETT');
  });

  it('should return an empty field when vaccine has invalid location data', () => {
    const vaccine = {
      location: {
        reference: '#in-location-3', // Reference to a non-existent location
      },
      contained: [
        {
          resourceType: 'Location',
          id: 'in-location-2',
          name: 'ADTP BURNETT',
        },
      ],
    };

    const result = extractLocation(vaccine);

    expect(result).to.equal('None noted');
  });

  it('should return an empty field when vaccine has no contained resources', () => {
    const vaccine = {
      location: {
        reference: '#in-location-2',
      },
      contained: [],
    };

    const result = extractLocation(vaccine);

    expect(result).to.equal('None noted');
  });
});
