import { expect } from 'chai';
import submitTransformer from '../../config/submit-transformer';

describe('Ask VA submit transformer', () => {
  // const buildFormData = () => {};

  it('should transform data correctly with file(s)', () => {
    const formData = {
      school: '333 - Midvale School for the Gifted',
      stateOfTheSchool: 'AL',
      address: {
        isMilitary: false,
        street: '123 Main st',
        city: 'Mordor',
        state: 'FL',
        country: 'USA',
      },
    };
    const askVAStore = {};
    const uploadFiles = [
      {
        fileName: 'test.pdf',
        base64: 'test-base64',
      },
    ];

    const result = submitTransformer(formData, uploadFiles, askVAStore);
    expect(result).to.deep.equal({
      ...formData,
      ...askVAStore,
      address: {
        city: 'Mordor',
        country: 'USA',
        isMilitary: false,
        militaryAddress: {
          militaryPostOffice: null,
          militaryState: null,
        },
        state: 'FL',
        street: '123 Main st',
      },
      country: 'USA',
      onBaseOutsideUS: false,
      files: [
        {
          FileName: 'test.pdf',
          FileContent: 'test-base64',
        },
      ],
      SchoolObj: {
        InstitutionName: 'Midvale School for the Gifted',
        SchoolFacilityCode: '333',
        StateAbbreviation: 'AL',
      },
    });
  });

  it('should transform data correctly with no file', () => {
    const formData = {
      school: '777 - Hogwarts School of Witchcraft and Wizardry',
      stateOfTheFacility: 'MI',
    };
    const askVAStore = {};
    const uploadFiles = null;

    const result = submitTransformer(formData, uploadFiles, askVAStore);
    expect(result).to.deep.equal({
      ...formData,
      ...askVAStore,
      address: null,
      // TODO: This is the default value when no files are uploaded;
      // I would much prefer an empty array. joehall-tw
      files: [
        {
          FileName: null,
          FileContent: null,
        },
      ],
      SchoolObj: {
        InstitutionName: 'Hogwarts School of Witchcraft and Wizardry',
        SchoolFacilityCode: '777',
        StateAbbreviation: 'MI',
      },
    });
  });

  it('should transform data correctly with no school', () => {
    const formData = {
      school: null,
      stateOfTheFacility: 'NY',
    };
    const askVAStore = {};
    const uploadFiles = null;

    const result = submitTransformer(formData, uploadFiles, askVAStore);
    expect(result).to.deep.equal({
      ...formData,
      ...askVAStore,
      address: null,
      // TODO: This is the default value when no files are uploaded;
      // I would much prefer an empty array. joehall-tw
      files: [
        {
          FileName: null,
          FileContent: null,
        },
      ],
      SchoolObj: {
        InstitutionName: undefined,
        SchoolFacilityCode: undefined,
        StateAbbreviation: 'NY',
      },
    });
  });
});
