import { expect } from 'chai';
import submitTransformer from '../../config/submit-transformer';

describe('Ask VA submit transformer', () => {
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
      requireSignIn: false,
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
      requireSignIn: false,
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
      requireSignIn: false,
    });
  });

  it('should use businessEmail and businessPhone when relationship to Veteran is WORK', () => {
    const formData = {
      businessEmail: 'business@test.com',
      businessPhone: '123-456-7890',
      emailAddress: 'personal@test.com',
      phoneNumber: '987-654-3210',
      school: null,
      stateOfTheFacility: 'NY',
      relationshipToVeteran:
        "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('business@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
    expect(result.businessPhone).to.equal('123-456-7890');
    expect(result.phoneNumber).to.equal('123-456-7890');
  });

  it('should use emailAddress and phoneNumber when Veteran is submitting ask-va', () => {
    const formData = {
      businessEmail: 'business@test.com',
      businessPhone: '123-456-7890',
      emailAddress: 'personal@test.com',
      phoneNumber: '987-654-3210',
      school: null,
      stateOfTheFacility: 'NY',
      relationshipToVeteran: "I'm the Veteran",
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('personal@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
    expect(result.businessPhone).to.equal('123-456-7890');
    expect(result.phoneNumber).to.equal('987-654-3210');
  });

  it('should use emailAddress and phoneNumber when the family member of Veteran is submitting ask-va', () => {
    const formData = {
      businessEmail: 'business@test.com',
      businessPhone: '123-456-7890',
      emailAddress: 'personal@test.com',
      phoneNumber: '987-654-3210',
      school: null,
      stateOfTheFacility: 'NY',
      relationshipToVeteran: "I'm a family member of a Veteran",
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('personal@test.com');
    expect(result.businessEmail).to.equal('business@test.com');
    expect(result.businessPhone).to.equal('123-456-7890');
    expect(result.phoneNumber).to.equal('987-654-3210');
  });

  it('should use emailAddress and phoneNumber and businessEmail and businessPhone should be undefined when the family member of Veteran is submitting ask-va', () => {
    const formData = {
      businessEmail: undefined,
      businessPhone: undefined,
      emailAddress: 'personal@test.com',
      phoneNumber: '987-654-3210',
      school: null,
      stateOfTheFacility: 'NY',
      relationshipToVeteran: "I'm a family member of a Veteran",
    };
    const result = submitTransformer(formData);
    expect(result.emailAddress).to.equal('personal@test.com');
    expect(result.businessEmail).to.be.undefined;
    expect(result.businessPhone).to.be.undefined;
    expect(result.phoneNumber).to.equal('987-654-3210');
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
