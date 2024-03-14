import { expect } from 'chai';

import v3formData from '../fixtures/data/v3formData.json';
import v4formData from '../fixtures/data/v4formData.json';
import v3formDataMigrated from '../fixtures/data/v3formDataMigrated.json';
import migrations from '../../migrations';

describe('Pension migrations', () => {
  it('should set url to service history if validation error', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        servicePeriods: [
          {
            activeServiceDateRange: {
              from: '2012-01-01',
            },
          },
        ],
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/military/history');
    expect(formData).to.be.an('object');
  });
  it('should set url to marriage page if dates are invalid', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        marriages: [
          {
            dateOfMarriage: '2012-01-01',
            'view:pastMarriage': {
              dateOfSeparation: '2011-01-01',
            },
          },
        ],
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/household/marriages/0');
    expect(formData).to.be.an('object');
  });
  it('should set url to spouse marriage page if dates are invalid', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        spouseMarriages: [
          {
            dateOfMarriage: '2012-01-01',
            dateOfSeparation: '2011-01-01',
          },
        ],
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/household/spouse-marriages/0');
    expect(formData).to.be.an('object');
  });
  it('should leave return url alone if no validation issues are found', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        spouseMarriages: [
          {
            dateOfMarriage: '2010-01-01',
            dateOfSeparation: '2011-01-01',
          },
        ],
        marriages: [
          {
            dateOfMarriage: '2010-01-01',
            'view:pastMarriage': {
              dateOfSeparation: '2011-01-01',
            },
          },
        ],
        servicePeriods: [
          {
            activeServiceDateRange: {
              from: '2014-01-01',
            },
          },
        ],
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'test',
      },
    });

    expect(metadata.returnUrl).to.equal('test');
    expect(formData).to.be.an('object');
  });
  it('should leave return url alone if no matching data exists', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'test',
      },
    });

    expect(metadata.returnUrl).to.equal('test');
    expect(formData).to.be.an('object');
  });
  it('should set url to address page if zip is bad', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        veteranAddress: {
          country: 'USA',
          postalCode: '234444',
        },
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/additional-information/contact');
    expect(formData).to.be.an('object');
  });
  it('should set url to applicant info page if file number is bad', () => {
    const { formData, metadata } = migrations[2]({
      formData: {
        vaFileNumber: '2312311',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/applicant/information');
    expect(formData).to.be.an('object');
  });
  it('should set url to spouse info page if file number is bad', () => {
    const { formData, metadata } = migrations[2]({
      formData: {
        vaFileNumber: '2312311',
        spouseVaFileNumber: '2312312',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal('/household/spouse-info');
    expect(formData).to.be.an('object');
  });
  it('should update from v3 to v4', () => {
    const { formData, metadata } = migrations[3]({
      formData: v3formData,
      metadata: {
        returnUrl: 'any',
      },
    });

    expect(metadata.returnUrl).to.equal('/applicant/information');
    expect(formData).to.be.an('object');

    const v3Fields = Object.keys(formData);
    const v4Fields = Object.keys(v3formDataMigrated);
    v3Fields.forEach(key => {
      expect(v4Fields.includes(key)).to.be.true;
    });
  });
  it('should update from v4 to v5', () => {
    const { formData } = migrations[4]({
      formData: v4formData,
      metadata: {
        returnUrl: 'any',
      },
    });

    expect(formData).to.be.an('object');
    expect(formData.maritalStatus).to.equal('SEPARATED');
    expect(formData.currentSpouseMaritalHistory).to.equal('IDK');
    expect(
      formData.marriages[0]['view:pastMarriage'].reasonForSeparation,
    ).to.equal('DIVORCE');
    expect(
      formData.marriages[1]['view:pastMarriage'].reasonForSeparation,
    ).to.equal('DEATH');
    expect(formData.marriages[2]['view:currentMarriage'].marriageType).to.equal(
      'CEREMONIAL',
    );
    expect(formData.dependents[0].childRelationship).to.equal('BIOLOGICAL');
    expect(formData.dependents[1].childRelationship).to.equal('ADOPTED');
    expect(formData.careExpenses[0].recipients).to.equal('VETERAN');
    expect(formData.careExpenses[1].recipients).to.equal('DEPENDENT');
    expect(formData.medicalExpenses[0].recipients).to.equal('VETERAN');
    expect(formData.medicalExpenses[1].recipients).to.equal('DEPENDENT');
  });

  it('should update from v5 to v6', () => {
    // This should have been removed in the migration to v4, but was missed
    const { formData, metadata } = migrations[5]({
      formData: {
        ...v4formData,
        'view:history': {
          jobs: [
            {
              name: 'test-job',
              jobTitle: 'test-title',
              address: {
                street: '1234 Random street',
                street2: 'Apt 2',
                city: 'Nopesville',
                state: 'VA',
                postalCode: '12345',
                country: 'USA',
              },
              daysMissed: '2',
              annualEarnings: 60000,
              dateRange: {
                from: '10121999',
                to: '10302000',
              },
            },
          ],
        },
      },
      metadata: {
        returnUrl: 'any',
      },
    });

    expect(metadata.returnUrl).to.equal('/applicant/information');
    expect(formData).to.be.an('object');
    expect(formData).to.not.have.any.keys(['view:history', 'jobs']);
    expect(formData).to.eql(v4formData);
  });
});
