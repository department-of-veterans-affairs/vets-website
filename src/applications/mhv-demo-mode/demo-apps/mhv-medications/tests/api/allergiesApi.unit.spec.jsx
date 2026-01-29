import { expect } from 'chai';
import {
  convertAllergy,
  convertAcceleratedAllergy,
  allergiesApi,
  apiBasePath,
  API_BASE_PATH_V2,
  buildGetAllergiesQuery,
  buildGetAllergyByIdQuery,
  transformAllergiesResponse,
  transformAllergyByIdResponse,
} from '../../api/allergiesApi';
import { FIELD_NONE_NOTED, FIELD_NOT_AVAILABLE } from '../../util/constants';
import allergiesFixture from '../fixtures/allergies.json';
import allergyFixture from '../fixtures/allergy.json';
import acceleratedAllergiesFixture from '../fixtures/acceleratedAllergies.json';

describe('allergiesApi', () => {
  describe('convertAllergy', () => {
    it('should convert a FHIR AllergyIntolerance resource', () => {
      const result = convertAllergy(allergyFixture);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('3106');
      expect(result.name).to.equal('NUTS');
    });

    it('should include reaction information', () => {
      const result = convertAllergy(allergyFixture);

      expect(result.reaction).to.be.an('array');
      expect(result.reaction).to.include('RASH');
    });

    it('should include location from recorder', () => {
      const result = convertAllergy(allergyFixture);

      expect(result.location).to.equal('SLC10.FO-BAYPINES.MED.VA.GOV');
    });

    it('should include notes', () => {
      const result = convertAllergy(allergyFixture);

      expect(result.notes).to.include("Maruf's test ");
    });

    it('should set type from category', () => {
      const result = convertAllergy(allergyFixture);

      expect(result.type).to.equal('Food');
    });

    it('should handle allergy without reactions', () => {
      const allergyWithoutReactions = {
        ...allergyFixture,
        reaction: [],
      };
      const result = convertAllergy(allergyWithoutReactions);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('3106');
    });

    it('should handle allergy without notes', () => {
      const allergyWithoutNotes = {
        ...allergyFixture,
        note: [],
      };
      const result = convertAllergy(allergyWithoutNotes);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('3106');
    });
  });

  describe('convertAcceleratedAllergy', () => {
    it('should convert an accelerated allergy object', () => {
      const mockAllergy = acceleratedAllergiesFixture.data[0];
      const result = convertAcceleratedAllergy(mockAllergy);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('2678');
      expect(result.name).to.equal('TRAZODONE');
    });

    it('should mark as Oracle Health data', () => {
      const mockAllergy = acceleratedAllergiesFixture.data[0];
      const result = convertAcceleratedAllergy(mockAllergy);

      expect(result.isOracleHealthData).to.be.true;
    });

    it('should handle allergy with reactions', () => {
      const allergyWithReactions = acceleratedAllergiesFixture.data[2]; // Penicillin
      const result = convertAcceleratedAllergy(allergyWithReactions);

      expect(result).to.be.an('object');
      expect(result.name).to.equal('Penicillin');
      expect(result.reaction).to.be.an('array');
    });

    it('should handle allergy with notes', () => {
      const allergyWithNotes = acceleratedAllergiesFixture.data[2]; // Penicillin
      const result = convertAcceleratedAllergy(allergyWithNotes);

      expect(result).to.be.an('object');
    });

    it('should set type from categories', () => {
      const mockAllergy = acceleratedAllergiesFixture.data[0]; // medication category
      const result = convertAcceleratedAllergy(mockAllergy);

      expect(result.type).to.equal('Medication');
    });

    it('should handle food category', () => {
      const foodAllergy = acceleratedAllergiesFixture.data[4]; // Radish - food
      const result = convertAcceleratedAllergy(foodAllergy);

      expect(result.type).to.equal('Food');
    });

    it('should handle environment category', () => {
      const envAllergy = acceleratedAllergiesFixture.data[3]; // Grass pollen - environment
      const result = convertAcceleratedAllergy(envAllergy);

      expect(result.type).to.equal('Environment');
    });
  });

  describe('buildGetAllergiesQuery', () => {
    it('should return default v1 path when no params provided', () => {
      const result = buildGetAllergiesQuery();

      expect(result.path).to.equal(`${apiBasePath}/medical_records/allergies`);
    });

    it('should return default v1 path when empty params provided', () => {
      const result = buildGetAllergiesQuery({});

      expect(result.path).to.equal(`${apiBasePath}/medical_records/allergies`);
    });

    it('should return v2 path when isAcceleratingAllergies is true', () => {
      const result = buildGetAllergiesQuery({ isAcceleratingAllergies: true });

      expect(result.path).to.equal(
        `${API_BASE_PATH_V2}/medical_records/allergies`,
      );
    });

    it('should return Cerner path when isCerner is true', () => {
      const result = buildGetAllergiesQuery({ isCerner: true });

      expect(result.path).to.equal(
        `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`,
      );
    });

    it('should prioritize isAcceleratingAllergies over isCerner', () => {
      const result = buildGetAllergiesQuery({
        isAcceleratingAllergies: true,
        isCerner: true,
      });

      expect(result.path).to.equal(
        `${API_BASE_PATH_V2}/medical_records/allergies`,
      );
    });
  });

  describe('buildGetAllergyByIdQuery', () => {
    it('should return default v1 path when no params provided', () => {
      const result = buildGetAllergyByIdQuery();

      expect(result.path).to.equal(`${apiBasePath}/medical_records/allergies`);
    });

    it('should return v2 path with ID when isAcceleratingAllergies is true', () => {
      const result = buildGetAllergyByIdQuery({
        id: '123',
        isAcceleratingAllergies: true,
      });

      expect(result.path).to.equal(
        `${API_BASE_PATH_V2}/medical_records/allergies/123`,
      );
    });

    it('should return Cerner path when isCerner is true', () => {
      const result = buildGetAllergyByIdQuery({ id: '123', isCerner: true });

      expect(result.path).to.equal(
        `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`,
      );
    });

    it('should prioritize isAcceleratingAllergies over isCerner', () => {
      const result = buildGetAllergyByIdQuery({
        id: '456',
        isAcceleratingAllergies: true,
        isCerner: true,
      });

      expect(result.path).to.equal(
        `${API_BASE_PATH_V2}/medical_records/allergies/456`,
      );
    });
  });

  describe('transformAllergiesResponse', () => {
    it('should transform response with entry array', () => {
      const result = transformAllergiesResponse(allergiesFixture);

      expect(result).to.be.an('array');
      expect(result.length).to.equal(allergiesFixture.entry.length);
      expect(result[0]).to.have.property('id');
      expect(result[0]).to.have.property('name');
    });

    it('should transform response with data array (accelerated format)', () => {
      const result = transformAllergiesResponse(acceleratedAllergiesFixture);

      expect(result).to.be.an('array');
      expect(result.length).to.equal(acceleratedAllergiesFixture.data.length);
      expect(result[0]).to.have.property('id');
      expect(result[0]).to.have.property('name');
    });

    it('should return empty array when response has no entry or data', () => {
      const result = transformAllergiesResponse({});

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when entry is not an array', () => {
      const result = transformAllergiesResponse({ entry: 'not an array' });

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when data is not an array', () => {
      const result = transformAllergiesResponse({ data: 'not an array' });

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when response is undefined', () => {
      const result = transformAllergiesResponse(undefined);

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when response is null', () => {
      const result = transformAllergiesResponse(null);

      expect(result).to.deep.equal([]);
    });
  });

  describe('transformAllergyByIdResponse', () => {
    it('should transform response with resource property', () => {
      const response = { resource: allergyFixture };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('3106');
      expect(result.name).to.equal('NUTS');
    });

    it('should transform response with entry array (first element)', () => {
      const response = {
        entry: [{ resource: allergyFixture }],
      };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('3106');
      expect(result.name).to.equal('NUTS');
    });

    it('should transform response with data property (accelerated format)', () => {
      const response = { data: acceleratedAllergiesFixture.data[0] };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.be.an('object');
      expect(result.id).to.equal('2678');
      expect(result.name).to.equal('TRAZODONE');
    });

    it('should return response as-is when no recognized format', () => {
      const response = { unknownFormat: 'data' };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.deep.equal(response);
    });

    it('should handle empty entry array', () => {
      const response = { entry: [] };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.deep.equal(response);
    });

    it('should handle entry array without resource property', () => {
      const response = { entry: [{ noResource: 'data' }] };
      const result = transformAllergyByIdResponse(response);

      expect(result).to.deep.equal(response);
    });
  });

  describe('allergiesApi endpoints', () => {
    describe('getAllergies', () => {
      describe('endpoint definition', () => {
        it('should have getAllergies endpoint defined', () => {
          expect(allergiesApi.endpoints.getAllergies).to.exist;
        });

        it('should have initiate function', () => {
          expect(allergiesApi.endpoints.getAllergies.initiate).to.be.a(
            'function',
          );
        });

        it('should have select function', () => {
          expect(allergiesApi.endpoints.getAllergies.select).to.be.a(
            'function',
          );
        });
      });
    });

    describe('getAllergyById', () => {
      describe('endpoint definition', () => {
        it('should have getAllergyById endpoint defined', () => {
          expect(allergiesApi.endpoints.getAllergyById).to.exist;
        });

        it('should have initiate function', () => {
          expect(allergiesApi.endpoints.getAllergyById.initiate).to.be.a(
            'function',
          );
        });

        it('should have select function', () => {
          expect(allergiesApi.endpoints.getAllergyById.select).to.be.a(
            'function',
          );
        });
      });
    });
  });

  describe('API paths', () => {
    it('should define allergiesApi with correct reducer path', () => {
      expect(allergiesApi.reducerPath).to.equal('allergiesApi');
    });

    it('should have endpoints property', () => {
      expect(allergiesApi.endpoints).to.be.an('object');
    });

    it('should export apiBasePath constant', () => {
      expect(apiBasePath).to.include('/my_health/v1');
    });

    it('should export API_BASE_PATH_V2 constant', () => {
      expect(API_BASE_PATH_V2).to.include('/my_health/v2');
    });
  });

  describe('exported hooks and endpoints', () => {
    it('should export useGetAllergiesQuery hook', () => {
      const { useGetAllergiesQuery } = allergiesApi;
      expect(useGetAllergiesQuery).to.be.a('function');
    });

    it('should export useGetAllergyByIdQuery hook', () => {
      const { useGetAllergyByIdQuery } = allergiesApi;
      expect(useGetAllergyByIdQuery).to.be.a('function');
    });

    it('should export usePrefetch hook', () => {
      const { usePrefetch } = allergiesApi;
      expect(usePrefetch).to.be.a('function');
    });

    it('should export getAllergies endpoint', () => {
      expect(allergiesApi.endpoints.getAllergies).to.exist;
    });

    it('should export getAllergyById endpoint', () => {
      expect(allergiesApi.endpoints.getAllergyById).to.exist;
    });
  });

  describe('allergyOptions configuration', () => {
    it('should configure emptyField as FIELD_NOT_AVAILABLE', () => {
      expect(FIELD_NOT_AVAILABLE).to.equal('Not available');
    });

    it('should configure noneNotedField as FIELD_NONE_NOTED', () => {
      expect(FIELD_NONE_NOTED).to.equal('None noted');
    });
  });
});
