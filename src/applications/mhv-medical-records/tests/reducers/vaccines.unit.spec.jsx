import { expect } from 'chai';
import {
  convertVaccine,
  convertNewVaccine,
  convertUnifiedVaccine,
  extractNote,
  extractReaction,
  extractLocation,
  vaccineReducer,
} from '../../reducers/vaccines';
import { Actions } from '../../util/actionTypes';
import { loadStates } from '../../util/constants';

describe('convertVaccine function', () => {
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

  it('should return None recorded if no contained Observation', () => {
    // Sample vaccine object without contained Observation
    const vaccineWithoutObservation = {
      contained: [],
    };

    const result = extractReaction(vaccineWithoutObservation);

    expect(result).to.eq('None recorded');
  });

  it('should return None recorded if contained Observation has no code.text', () => {
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

    expect(result).to.eq('None recorded');
  });

  it('should return None recorded if no contained resources', () => {
    // Sample vaccine object with empty contained array
    const vaccineWithEmptyContained = {
      contained: [],
    };

    const result = extractReaction(vaccineWithEmptyContained);

    expect(result).to.eq('None recorded');
  });
});

describe('extractLocation function', () => {
  it('should return an empty field when vaccine has no location data', () => {
    const vaccine = {};

    const result = extractLocation(vaccine);

    expect(result).to.equal('None recorded');
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

    expect(result).to.equal('None recorded');
  });

  it('should return an empty field when vaccine has no contained resources', () => {
    const vaccine = {
      location: {
        reference: '#in-location-2',
      },
      contained: [],
    };

    const result = extractLocation(vaccine);

    expect(result).to.equal('None recorded');
  });
});

describe('convertNewVaccine', () => {
  const MISSING_FIELD_VAL = 'None recorded';

  it('should return null if it is not passed an argument', () => {
    expect(convertNewVaccine()).to.eq(null);
  });

  it('should return null if null is passed as argument', () => {
    expect(convertNewVaccine(null)).to.eq(null);
  });

  it('should correctly format date when dateReceived is provided', () => {
    const vaccine = {
      id: '123',
      name: 'COVID-19',
      dateReceived: '2023-12-07T08:43:00-05:00',
    };

    const result = convertNewVaccine(vaccine);

    expect(result.date).to.eq('December 7, 2023');
  });

  it('should return "None recorded" for missing data fields', () => {
    const vaccine = {
      id: '123',
      name: 'COVID-19',
    };

    const result = convertNewVaccine(vaccine);

    expect(result.date).to.eq(MISSING_FIELD_VAL);
    expect(result.location).to.eq(MISSING_FIELD_VAL);
    expect(result.manufacturer).to.eq(MISSING_FIELD_VAL);
    expect(result.reactions).to.eq(MISSING_FIELD_VAL);
  });

  it('should preserve all original properties and add formatted properties', () => {
    const vaccine = {
      id: '123',
      name: 'Hepatitis B',
      dateReceived: '2023-01-10',
      location: 'VA Hospital',
      manufacturer: 'Moderna',
      reactions: 'None',
      notes: ['First dose', 'Second dose'],
    };

    const result = convertNewVaccine(vaccine);

    expect(result).to.include({
      id: '123',
      name: 'Hepatitis B',
      date: 'January 10, 2023',
      location: 'VA Hospital',
      manufacturer: 'Moderna',
      reactions: 'None',
    });
    expect(result.notes).to.deep.equal(['First dose', 'Second dose']);
  });
});

describe('vaccineReducer', () => {
  describe('GET action', () => {
    it('should use convertVaccine for FHIR format responses', () => {
      const fhirResponse = {
        resourceType: 'Immunization',
        id: '123',
        vaccineCode: {
          text: 'COVID-19 Vaccine',
        },
        occurrenceDateTime: '2023-05-15',
      };

      const expectedVaccine = convertVaccine(fhirResponse);

      const newState = vaccineReducer(
        {},
        { type: Actions.Vaccines.GET, response: fhirResponse },
      );

      expect(newState.vaccineDetails).to.deep.equal(expectedVaccine);
    });

    it('should use convertNewVaccine for non-FHIR format responses', () => {
      const nonFhirResponse = {
        data: {
          attributes: {
            id: '123',
            name: 'COVID-19 Vaccine',
            dateReceived: '2023-05-15',
          },
        },
      };

      const expectedVaccine = convertNewVaccine(
        nonFhirResponse.data.attributes,
      );

      const newState = vaccineReducer(
        {},
        { type: Actions.Vaccines.GET, response: nonFhirResponse },
      );

      expect(newState.vaccineDetails).to.deep.equal(expectedVaccine);
    });

    it('should handle null response gracefully', () => {
      const newState = vaccineReducer(
        {},
        { type: Actions.Vaccines.GET, response: null },
      );

      expect(newState.vaccineDetails).to.equal(null);
    });
  });

  describe('GET_LIST action', () => {
    describe('useBackendPagination is true', () => {
      it('should replace the existing list', () => {
        // Initial state with existing vaccines list
        const initialState = {
          vaccinesList: [
            { id: '1', name: 'Previous Vaccine 1' },
            { id: '2', name: 'Previous Vaccine 2' },
          ],
        };

        // New response with different vaccines
        const response = {
          data: [
            {
              attributes: {
                id: '3',
                name: 'New Vaccine 3',
                dateReceived: '2023-05-15',
              },
            },
            {
              attributes: {
                id: '4',
                name: 'New Vaccine 4',
                dateReceived: '2023-01-10',
              },
            },
          ],
        };

        const newState = vaccineReducer(initialState, {
          type: Actions.Vaccines.GET_LIST,
          response,
          useBackendPagination: true,
          isCurrent: true,
        });

        // Should completely replace the list with new items
        expect(newState.vaccinesList).to.have.lengthOf(2);
        expect(newState.vaccinesList[0].id).to.equal('3');
        expect(newState.vaccinesList[1].id).to.equal('4');
        // Should not have updatedList when useBackendPagination is true
        expect(newState.updatedList).to.equal(undefined);
      });
    });

    describe('useBackendPagination is false', () => {
      it('should preserve existing list in vaccinesList and put new data in updatedList', () => {
        // Initial state with existing vaccines list
        const initialState = {
          vaccinesList: [
            { id: '1', name: 'Previous Vaccine 1' },
            { id: '2', name: 'Previous Vaccine 2' },
          ],
        };

        // New response with different vaccines
        const response = {
          data: [
            {
              attributes: {
                id: '3',
                name: 'New Vaccine 3',
                dateReceived: '2023-05-15',
              },
            },
            {
              attributes: {
                id: '4',
                name: 'New Vaccine 4',
                dateReceived: '2023-01-10',
              },
            },
          ],
        };

        const newState = vaccineReducer(initialState, {
          type: Actions.Vaccines.GET_LIST,
          response,
          useBackendPagination: false,
          isCurrent: true,
        });

        // Should preserve the original list
        expect(newState.vaccinesList).to.have.lengthOf(2);
        expect(newState.vaccinesList[0].id).to.equal('1');
        expect(newState.vaccinesList[1].id).to.equal('2');
        // Should store new items in updatedList
        expect(newState.updatedList).to.have.lengthOf(2);
        expect(newState.updatedList[0].id).to.equal('3');
        expect(newState.updatedList[1].id).to.equal('4');
      });

      it('should set vaccinesList to new list when initial state has undefined vaccinesList', () => {
        // Initial state with undefined vaccinesList
        const initialState = {
          vaccinesList: undefined,
        };

        // New response
        const response = {
          data: [
            {
              attributes: {
                id: '3',
                name: 'New Vaccine 3',
                dateReceived: '2023-05-15',
              },
            },
          ],
        };

        const newState = vaccineReducer(initialState, {
          type: Actions.Vaccines.GET_LIST,
          response,
          useBackendPagination: false, // Even with false, should use new list
          isCurrent: true,
        });

        // Should set vaccinesList to the new list
        expect(newState.vaccinesList).to.have.lengthOf(1);
        expect(newState.vaccinesList[0].id).to.equal('3');
        // Should not set updatedList when vaccinesList was undefined
        expect(newState.updatedList).to.equal(undefined);
      });
    });

    it('creates a list', () => {
      const response = {
        entry: [
          { resource: { id: 1 } },
          { resource: { id: 2 } },
          { resource: { id: 3 } },
        ],
        resourceType: 'Immunization',
      };
      const newState = vaccineReducer(
        {},
        { type: Actions.Vaccines.GET_LIST, response },
      );
      expect(newState.vaccinesList.length).to.equal(3);
      expect(newState.updatedList).to.equal(undefined);
    });

    it('puts updated records in updatedList', () => {
      const response = {
        entry: [
          { resource: { id: 1 } },
          { resource: { id: 2 } },
          { resource: { id: 3 } },
        ],
        resourceType: 'Immunization',
      };
      const newState = vaccineReducer(
        {
          vaccinesList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
        },
        { type: Actions.Vaccines.GET_LIST, response },
      );
      expect(newState.vaccinesList.length).to.equal(2);
      expect(newState.updatedList.length).to.equal(3);
    });

    it('should use convertVaccine for FHIR format responses', () => {
      const fhirResponse = {
        resourceType: 'Bundle',
        entry: [
          {
            resource: {
              resourceType: 'Immunization',
              id: '123',
              vaccineCode: { text: 'COVID-19' },
              occurrenceDateTime: '2023-05-15',
            },
          },
          {
            resource: {
              resourceType: 'Immunization',
              id: '456',
              vaccineCode: { text: 'Flu Shot' },
              occurrenceDateTime: '2023-01-10',
            },
          },
        ],
      };

      const newState = vaccineReducer(
        {},
        {
          type: Actions.Vaccines.GET_LIST,
          response: fhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.vaccinesList).to.have.lengthOf(2);
      expect(newState.vaccinesList[0]).to.include({
        id: '123',
        name: 'COVID-19',
      });
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });

    it('should properly handle no results for FHIR format responses', () => {
      const fhirResponse = { resourceType: 'Bundle' };

      const newState = vaccineReducer(
        {},
        {
          type: Actions.Vaccines.GET_LIST,
          response: fhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.vaccinesList).to.have.lengthOf(0);
    });

    it('should use convertNewVaccine for non-FHIR format responses', () => {
      const nonFhirResponse = {
        data: [
          {
            attributes: {
              id: '123',
              name: 'COVID-19 Vaccine',
              dateReceived: '2023-05-15',
            },
          },
          {
            attributes: {
              id: '456',
              name: 'Flu Shot',
              dateReceived: '2023-01-10',
            },
          },
        ],
      };

      const newState = vaccineReducer(
        {},
        {
          type: Actions.Vaccines.GET_LIST,
          response: nonFhirResponse,
          isCurrent: true,
        },
      );

      expect(newState.vaccinesList).to.have.lengthOf(2);
      expect(newState.vaccinesList[0]).to.include({
        id: '123',
        name: 'COVID-19 Vaccine',
      });
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });
  });

  it('should properly handle no results for non-FHIR format responses', () => {
    const fhirResponse = { data: [] };

    const newState = vaccineReducer(
      {},
      {
        type: Actions.Vaccines.GET_LIST,
        response: fhirResponse,
        isCurrent: true,
      },
    );

    expect(newState.vaccinesList).to.have.lengthOf(0);
  });

  describe('COPY_UPDATED_LIST action', () => {
    it('moves updatedList into vaccinesList on request', () => {
      const newState = vaccineReducer(
        {
          vaccinesList: [{ resource: { id: 1 } }],
          updatedList: [{ resource: { id: 1 } }, { resource: { id: 2 } }],
        },
        { type: Actions.Vaccines.COPY_UPDATED_LIST },
      );
      expect(newState.vaccinesList.length).to.equal(2);
      expect(newState.updatedList).to.equal(undefined);
    });

    it('does not move updatedList into vaccinesList if updatedList does not exist', () => {
      const newState = vaccineReducer(
        {
          vaccinesList: [{ resource: { id: 1 } }],
          updatedList: undefined,
        },
        { type: Actions.Vaccines.COPY_UPDATED_LIST },
      );
      expect(newState.vaccinesList.length).to.equal(1);
      expect(newState.updatedList).to.equal(undefined);
    });
  });

  describe('CLEAR_DETAIL action', () => {
    it('should clear vaccineDetails', () => {
      const initialState = {
        vaccineDetails: { id: '123', name: 'Type 2 Diabetes' },
      };

      const newState = vaccineReducer(initialState, {
        type: Actions.Vaccines.CLEAR_DETAIL,
      });

      expect(newState.vaccineDetails).to.equal(undefined);
    });
  });

  describe('UPDATE_LIST_STATE action', () => {
    it('should update listState to the provided payload', () => {
      const newState = vaccineReducer(
        { listState: 'PRE_FETCH' },
        { type: Actions.Vaccines.UPDATE_LIST_STATE, payload: 'FETCHING' },
      );

      expect(newState.listState).to.equal('FETCHING');
    });
  });
});

describe('convertUnifiedVaccine', () => {
  const MISSING_FIELD_VAL = 'None recorded';

  it('should return null if no record is passed', () => {
    expect(convertUnifiedVaccine()).to.eq(null);
  });

  it('should return null if null is passed as argument', () => {
    expect(convertUnifiedVaccine(null)).to.eq(null);
  });

  it('should return null if undefined is passed as argument', () => {
    expect(convertUnifiedVaccine(undefined)).to.eq(null);
  });

  it('should correctly convert a unified vaccine record with all fields', () => {
    const record = {
      id: '456',
      attributes: {
        groupName: 'Hepatitis B',
        date: '2023-06-20T10:30:00-04:00',
        location: 'VA Medical Center',
        manufacturer: 'Pfizer',
        reaction: 'Mild soreness',
        note: 'First dose in series',
      },
    };

    const result = convertUnifiedVaccine(record);

    expect(result).to.deep.equal({
      id: '456',
      name: 'Hepatitis B',
      date: 'June 20, 2023',
      location: 'VA Medical Center',
      manufacturer: 'Pfizer',
      reaction: 'Mild soreness',
      note: 'First dose in series',
    });
  });

  it('should use "None recorded" for missing optional fields', () => {
    const record = {
      id: '789',
      attributes: {
        groupName: 'Flu Shot',
        date: '2024-01-15T14:20:00-05:00',
        // Missing location, manufacturer, reaction, note
      },
    };

    const result = convertUnifiedVaccine(record);

    expect(result).to.deep.equal({
      id: '789',
      name: 'Flu Shot',
      date: 'January 15, 2024',
      location: MISSING_FIELD_VAL,
      manufacturer: MISSING_FIELD_VAL,
      reaction: MISSING_FIELD_VAL,
      note: MISSING_FIELD_VAL,
    });
  });

  it('should handle empty string values for optional fields', () => {
    const record = {
      id: '101',
      attributes: {
        groupName: 'COVID-19',
        date: '2023-12-01T09:15:00-06:00',
        location: '',
        manufacturer: '',
        reaction: '',
        note: '',
      },
    };

    const result = convertUnifiedVaccine(record);

    expect(result).to.deep.equal({
      id: '101',
      name: 'COVID-19',
      date: 'December 1, 2023',
      location: MISSING_FIELD_VAL,
      manufacturer: MISSING_FIELD_VAL,
      reaction: MISSING_FIELD_VAL,
      note: MISSING_FIELD_VAL,
    });
  });

  it('should handle record with missing attributes object', () => {
    const record = {
      id: '202',
      // Missing attributes object
    };

    const result = convertUnifiedVaccine(record);
    expect(result).to.deep.equal({
      id: '202',
      name: MISSING_FIELD_VAL,
      date: MISSING_FIELD_VAL,
      location: MISSING_FIELD_VAL,
      manufacturer: MISSING_FIELD_VAL,
      reaction: MISSING_FIELD_VAL,
      note: MISSING_FIELD_VAL,
    });
  });
});

describe('vaccineReducer - GET_UNIFIED_LIST action', () => {
  it('should create a new list using convertUnifiedVaccine', () => {
    const response = {
      data: [
        {
          id: '123',
          attributes: {
            groupName: 'COVID-19',
            date: '2023-05-15T10:30:00-04:00',
            location: 'VA Medical Center',
            manufacturer: 'Pfizer',
            reaction: 'Mild soreness',
            note: 'First dose',
          },
        },
        {
          id: '456',
          attributes: {
            groupName: 'Flu Shot',
            date: '2023-01-10T14:20:00-05:00',
            location: 'Community Clinic',
            manufacturer: 'Moderna',
            reaction: 'None',
            note: 'Annual flu shot',
          },
        },
      ],
      meta: {
        pagination: {
          totalEntries: 2,
        },
      },
    };

    const newState = vaccineReducer(
      {},
      {
        type: Actions.Vaccines.GET_UNIFIED_LIST,
        response,
        isCurrent: true,
      },
    );

    expect(newState.vaccinesList).to.have.lengthOf(2);
    expect(newState.vaccinesList[0]).to.deep.equal({
      id: '123',
      name: 'COVID-19',
      date: 'May 15, 2023',
      location: 'VA Medical Center',
      manufacturer: 'Pfizer',
      reaction: 'Mild soreness',
      note: 'First dose',
    });
    expect(newState.vaccinesList[1]).to.deep.equal({
      id: '456',
      name: 'Flu Shot',
      date: 'January 10, 2023',
      location: 'Community Clinic',
      manufacturer: 'Moderna',
      reaction: 'None',
      note: 'Annual flu shot',
    });
    expect(newState.listState).to.equal(loadStates.FETCHED);
    expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    expect(newState.listMetadata).to.deep.equal(response.meta);
  });

  it('should filter out null records from convertUnifiedVaccine', () => {
    const response = {
      data: [
        {
          id: '123',
          attributes: {
            groupName: 'COVID-19',
            date: '2023-05-15T10:30:00-04:00',
          },
        },
        null, // This should be filtered out
        {
          id: '456',
          attributes: {
            groupName: 'Flu Shot',
            date: '2023-01-10T14:20:00-05:00',
          },
        },
      ],
      meta: {},
    };

    const newState = vaccineReducer(
      {},
      {
        type: Actions.Vaccines.GET_UNIFIED_LIST,
        response,
        isCurrent: true,
      },
    );

    expect(newState.vaccinesList).to.have.lengthOf(2);
    expect(newState.vaccinesList[0].id).to.equal('123');
    expect(newState.vaccinesList[1].id).to.equal('456');
  });

  it('should sort vaccines by date in descending order', () => {
    const response = {
      data: [
        {
          id: '123',
          attributes: {
            groupName: 'COVID-19',
            date: '2023-01-15T10:30:00-04:00', // Older date
          },
        },
        {
          id: '456',
          attributes: {
            groupName: 'Flu Shot',
            date: '2023-05-20T14:20:00-05:00', // Newer date
          },
        },
      ],
      meta: {},
    };

    const newState = vaccineReducer(
      {},
      {
        type: Actions.Vaccines.GET_UNIFIED_LIST,
        response,
        isCurrent: true,
      },
    );

    expect(newState.vaccinesList).to.have.lengthOf(2);
    // Newer date should come first
    expect(newState.vaccinesList[0].id).to.equal('456');
    expect(newState.vaccinesList[0].date).to.equal('May 20, 2023');
    expect(newState.vaccinesList[1].id).to.equal('123');
    expect(newState.vaccinesList[1].date).to.equal('January 15, 2023');
  });

  it('should preserve existing list and put new data in updatedList when oldList exists', () => {
    const initialState = {
      vaccinesList: [
        { id: '1', name: 'Previous Vaccine 1' },
        { id: '2', name: 'Previous Vaccine 2' },
      ],
    };

    const response = {
      data: [
        {
          id: '123',
          attributes: {
            groupName: 'COVID-19',
            date: '2023-05-15T10:30:00-04:00',
          },
        },
      ],
      meta: {},
    };

    const newState = vaccineReducer(initialState, {
      type: Actions.Vaccines.GET_UNIFIED_LIST,
      response,
      isCurrent: true,
    });

    // Should preserve the original list
    expect(newState.vaccinesList).to.have.lengthOf(2);
    expect(newState.vaccinesList[0].id).to.equal('1');
    expect(newState.vaccinesList[1].id).to.equal('2');
    // Should store new items in updatedList
    expect(newState.updatedList).to.have.lengthOf(1);
    expect(newState.updatedList[0].id).to.equal('123');
  });

  it('should handle empty data array', () => {
    const response = {
      data: [],
      meta: {},
    };

    const newState = vaccineReducer(
      {},
      {
        type: Actions.Vaccines.GET_UNIFIED_LIST,
        response,
        isCurrent: true,
      },
    );

    expect(newState.vaccinesList).to.have.lengthOf(0);
    expect(newState.listState).to.equal(loadStates.FETCHED);
  });
});
