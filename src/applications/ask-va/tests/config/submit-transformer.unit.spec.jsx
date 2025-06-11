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
        InstitutionName: null,
        SchoolFacilityCode: null,
        StateAbbreviation: 'NY',
      },
    });
  });

  it('should use businessEmail when emailAddress is not present', () => {
    const formData = {
      businessEmail: 'business@test.com',
      school: null,
      stateOfTheFacility: 'NY',
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('business@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
  });

  it('should use businessPhone when phoneNumber is not present', () => {
    const formData = {
      businessPhone: '123-456-7890',
      school: null,
      stateOfTheFacility: 'NY',
    };
    const result = submitTransformer(formData);
    expect(result.phoneNumber).to.equal('123-456-7890');
    expect(result.businessPhone).to.equal('123-456-7890');
  });

  it('should update businessEmail when it does not exist but emailAddress does', () => {
    const formData = {
      school: null,
      stateOfTheFacility: 'NY',
      emailAddress: 'personal@test.com',
      businessEmail: undefined,
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('personal@test.com');
    expect(result.businessEmail).to.equal('personal@test.com');
  });

  it('should update emailAddress when it does not exist but businessEmail does', () => {
    const formData = {
      school: null,
      stateOfTheFacility: 'NY',
      emailAddress: undefined,
      businessEmail: 'business@test.com',
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('business@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
  });

  it('should prioritize businessEmail when both email fields exist', () => {
    const formData = {
      school: null,
      stateOfTheFacility: 'NY',
      emailAddress: 'personal@test.com',
      businessEmail: 'business@test.com',
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('business@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
  });

  it('should update businessPhone when it does not exist but phoneNumber does', () => {
    const formData = {
      phoneNumber: '111-222-3333',
      school: null,
      stateOfTheFacility: 'NY',
      businessPhone: undefined,
    };
    const result = submitTransformer(formData);
    expect(result.phoneNumber).to.equal('111-222-3333');
    expect(result.businessPhone).to.equal('111-222-3333');
  });

  it('should update phoneNumber when it does not exist but businessPhone does', () => {
    const formData = {
      phoneNumber: undefined,
      school: null,
      stateOfTheFacility: 'NY',
      businessPhone: '123-456-7890',
    };
    const result = submitTransformer(formData);
    expect(result.phoneNumber).to.equal('123-456-7890');
    expect(result.businessPhone).to.equal('123-456-7890');
  });

  it('should prioritize businessPhone when both phone fields exist', () => {
    const formData = {
      phoneNumber: '111-222-3333',
      school: null,
      stateOfTheFacility: 'NY',
      businessPhone: '123-456-7890',
    };
    const result = submitTransformer(formData);
    expect(result.phoneNumber).to.equal('123-456-7890');
    expect(result.businessPhone).to.equal('123-456-7890');
  });

  it('should ensure both business and personal email and phone exist if only one is present', () => {
    const formData = {
      phoneNumber: '111-222-3333',
      businessEmail: 'business@test.com',
      school: null,
      stateOfTheFacility: 'NY',
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('business@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
    expect(result.phoneNumber).to.equal('111-222-3333');
    expect(result.businessPhone).to.equal('111-222-3333');
  });

  it('should handle missing email and phone fields', () => {
    const formData = {
      school: null,
      stateOfTheFacility: 'NY',
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.be.undefined;
    expect(result.businessEmail).to.be.undefined;
    expect(result.phoneNumber).to.be.undefined;
    expect(result.businessPhone).to.be.undefined;
  });
});
