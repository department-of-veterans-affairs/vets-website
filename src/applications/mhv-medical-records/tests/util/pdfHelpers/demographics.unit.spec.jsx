import { expect } from 'chai';
import { generateDemographicsContent } from '../../../util/pdfHelpers/demographics';
import { NONE_RECORDED, NO_INFO_REPORTED } from '../../../util/constants';

describe('generateDemographicsContent', () => {
  it('should replace sections with all empty values with NO_INFO_REPORTED', () => {
    const record = {
      firstName: 'John',
      // Missing nested object (undefined)
      eligibility: {}, // Empty object (all values undefined)
      employment: {
        occupation: null,
        meansTestStatus: null,
        employerName: null,
      },
      civilGuardian: {
        name: undefined,
        homePhone: null,
        workPhone: NONE_RECORDED,
        address: {
          street: undefined,
          city: undefined,
          state: null,
          zipcode: NONE_RECORDED,
        },
      },
    };

    const result = generateDemographicsContent(record);

    // Missing nested object
    const addressSection = result.results.items.find(
      item => item.header === 'Permanent address and contact information',
    );
    expect(addressSection.items).to.have.lengthOf(1);
    expect(addressSection.items[0].value).to.equal(NO_INFO_REPORTED);

    // Empty object
    const eligibilitySection = result.results.items.find(
      item => item.header === 'Eligibility',
    );
    expect(eligibilitySection.items).to.have.lengthOf(1);
    expect(eligibilitySection.items[0].value).to.equal(NO_INFO_REPORTED);

    // All null
    const employmentSection = result.results.items.find(
      item => item.header === 'Employment',
    );
    expect(employmentSection.items).to.have.lengthOf(1);
    expect(employmentSection.items[0].value).to.equal(NO_INFO_REPORTED);

    // Mixed empty values
    const civilGuardianSection = result.results.items.find(
      item => item.header === 'Civil guardian',
    );
    expect(civilGuardianSection.items).to.have.lengthOf(1);
    expect(civilGuardianSection.items[0].value).to.equal(NO_INFO_REPORTED);
  });

  it('should keep sections with at least one valid value', () => {
    const record = {
      firstName: 'John',
      permanentAddress: {
        street: '123 Main St',
        city: undefined,
        state: null,
        zipcode: NONE_RECORDED,
      },
      primaryNextOfKin: {
        name: 'Jane Doe',
        // address missing entirely
        homePhone: undefined,
      },
    };

    const result = generateDemographicsContent(record);

    const addressSection = result.results.items.find(
      item => item.header === 'Permanent address and contact information',
    );
    expect(addressSection.items.length).to.be.greaterThan(1);
    expect(addressSection.items[0].value).to.equal('123 Main St');

    const nextOfKinSection = result.results.items.find(
      item => item.header === 'Primary next of kin',
    );
    expect(nextOfKinSection.items.length).to.be.greaterThan(1);
    const nameItem = nextOfKinSection.items.find(item => item.title === 'Name');
    expect(nameItem.value).to.equal('Jane Doe');
  });
});
