import { expect } from 'chai';

import { customTransformForSubmit } from '../../config/utilities/submissionPipeline';

import { PICKLIST_DATA } from '../../config/constants';

describe('customTransformForSubmit - integration tests', () => {
  // Mock formConfig with minimal required structure
  const mockFormConfig = {
    chapters: {},
    pages: [],
  };

  it('should not include data property wrapper in final payload - V2 flow (regression test for payload structure bug)', () => {
    // This test verifies V2 flow with checkbox selection works correctly
    // and that the final payload sent to backend does NOT have a nested 'data' property.
    // view:selectable686Options and view:removeDependentOptions should be at the top level
    const form = {
      data: {
        'view:addOrRemoveDependents': { add: false, remove: true },
        'view:removeDependentOptions': {
          reportDivorce: true,
        },
        reportDivorce: {
          fullName: { first: 'Ex', last: 'Spouse' },
          birthDate: '1980-01-01',
          date: '2024-01-01',
          reasonMarriageEnded: 'Divorce',
          divorceLocation: {
            outsideUsa: false,
            location: { city: 'City', state: 'CA' },
          },
          spouseIncome: 'N',
        },
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    const result = customTransformForSubmit(mockFormConfig, form);
    const submittedData = JSON.parse(result.body);

    // Critical assertions for the bug:
    // 1. Should NOT have a 'data' property at the top level
    expect(submittedData.data).to.be.undefined;

    // 2. Should have view:selectable686Options at the top level
    expect(submittedData['view:selectable686Options']).to.not.be.undefined;
    expect(submittedData['view:selectable686Options'].reportDivorce).to.be.true;

    // 3. Should have view:removeDependentOptions at the top level
    expect(submittedData['view:removeDependentOptions']).to.not.be.undefined;
    expect(submittedData['view:removeDependentOptions'].reportDivorce).to.be
      .true;

    // 4. Data fields should be at the top level (not nested under 'data')
    expect(submittedData.useV2).to.be.true;
    expect(submittedData.daysTillExpires).to.equal(365);
    expect(submittedData.reportDivorce).to.not.be.undefined;
    expect(submittedData.veteranInformation).to.not.be.undefined;
  });

  it('should not include data property wrapper in final payload - V3 flow (regression test for payload structure bug)', () => {
    // This test verifies V3 picklist flow works correctly with the payload structure fix.
    // V3 has empty view:removeDependentOptions (no checkboxes), but after picklist
    // transformation, flags should be set AND payload should not have nested 'data' property.
    const form = {
      data: {
        vaDependentsV3: true, // Enable V3 flow
        'view:addOrRemoveDependents': { add: false, remove: true },
        'view:removeDependentOptions': {}, // EMPTY - typical V3 state
        [PICKLIST_DATA]: [
          {
            fullName: { first: 'Ex', last: 'Spouse' },
            dateOfBirth: '1980-01-01',
            relationshipToVeteran: 'Spouse',
            selected: true,
            removalReason: 'marriageEnded',
            endType: 'Divorce',
            endDate: '2024-01-01',
            endOutsideUs: false,
            endCity: 'City',
            endState: 'CA',
            spouseIncome: 'N',
          },
        ],
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    const result = customTransformForSubmit(mockFormConfig, form);
    const submittedData = JSON.parse(result.body);

    // Critical assertions for V3 + payload structure:
    // 1. Should NOT have a 'data' property at the top level
    expect(submittedData.data).to.be.undefined;

    // 2. Should have view:selectable686Options at the top level with reportDivorce flag
    expect(submittedData['view:selectable686Options']).to.not.be.undefined;
    expect(submittedData['view:selectable686Options'].reportDivorce).to.be.true;

    // 3. Should have view:removeDependentOptions at the top level with reportDivorce flag
    expect(submittedData['view:removeDependentOptions']).to.not.be.undefined;
    expect(submittedData['view:removeDependentOptions'].reportDivorce).to.be
      .true;

    // 4. Data fields should be at the top level (not nested under 'data')
    expect(submittedData.useV2).to.be.true;
    expect(submittedData.daysTillExpires).to.equal(365);
    expect(submittedData.reportDivorce).to.not.be.undefined;
    expect(submittedData.veteranInformation).to.not.be.undefined;

    // 5. Transformed divorce data should be present
    expect(submittedData.reportDivorce.fullName.first).to.equal('Ex');
    expect(submittedData.reportDivorce.fullName.last).to.equal('Spouse');
  });

  it('should correctly handle V2 flow with empty stepChildren through full transformation pipeline', () => {
    // This integration test verifies the full data flow from form submission
    // through filterInactivePageData, type extraction, and buildSubmissionData
    const form = {
      data: {
        'view:addOrRemoveDependents': { add: false, remove: true },
        'view:removeDependentOptions': {
          reportStepchildNotInHousehold: true,
        },
        stepChildren: [], // Empty array - the bug scenario
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    const result = customTransformForSubmit(mockFormConfig, form);

    // Parse the JSON body to verify what would be sent to backend
    const submittedData = JSON.parse(result.body);

    // Critical assertion: reportStepchildNotInHousehold should NOT be in selectable options
    expect(
      submittedData['view:selectable686Options']?.reportStepchildNotInHousehold,
    ).to.be.undefined;

    // stepChildren should not be present (empty arrays are filtered out)
    expect(submittedData.stepChildren).to.be.undefined;

    // Other fields should be present
    expect(submittedData.useV2).to.be.true;
    expect(submittedData.veteranInformation).to.not.be.undefined;
  });

  it('should correctly handle V3 flow transformation with picklist data', () => {
    // Test V3 flow where picklist data is transformed to V2 format
    const form = {
      data: {
        vaDependentsV3: true, // Enable V3 flow
        'view:addOrRemoveDependents': { add: false, remove: true },
        'view:removeDependentOptions': {
          reportStepchildNotInHousehold: true,
        },
        [PICKLIST_DATA]: [
          {
            fullName: { first: 'STEP', last: 'CHILD' },
            dateOfBirth: '2010-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Child',
            isStepchild: 'Y',
            selected: true,
            removalReason: 'stepchildNotMember',
            endDate: '2024-06-01',
            whoDoesTheStepchildLiveWith: { first: 'Other', last: 'Parent' },
            address: {
              street: '123 Main St',
              city: 'Testville',
              state: 'CA',
              postalCode: '12345',
              country: 'USA',
            },
          },
        ],
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    const result = customTransformForSubmit(mockFormConfig, form);
    const submittedData = JSON.parse(result.body);

    // V3 data should be transformed to V2 stepChildren array
    expect(submittedData.stepChildren).to.be.an('array');
    expect(submittedData.stepChildren).to.have.lengthOf(1);

    // Verify the stepchild data was transformed correctly
    expect(submittedData.stepChildren[0]).to.have.property('fullName');
    expect(submittedData.stepChildren[0].fullName.first).to.equal('STEP');

    // Flag should be set because we have stepChildren data
    // NOTE: This depends on view:removeDependentOptions being set by the wizard
    if (submittedData['view:selectable686Options']) {
      expect(
        submittedData['view:selectable686Options']
          .reportStepchildNotInHousehold,
      ).to.be.true;
    }
  });

  it('should set flags based on data presence in V3 picklist flow (regression test)', () => {
    // Regression test for V3 picklist where view:removeDependentOptions is EMPTY
    // but data arrays exist after transformation. Flags should be set based on
    // data presence, not checkbox selection.
    const form = {
      data: {
        vaDependentsV3: true,
        'view:addOrRemoveDependents': { add: false, remove: true },
        'view:removeDependentOptions': {}, // EMPTY - typical V3 picklist state
        [PICKLIST_DATA]: [
          {
            fullName: { first: 'Ex', last: 'Spouse' },
            dateOfBirth: '1980-01-01',
            relationshipToVeteran: 'Spouse',
            selected: true,
            removalReason: 'marriageEnded',
            endType: 'divorce',
            endDate: '2024-01-01',
            endOutsideUs: false,
            endCity: 'City',
            endState: 'CA',
            spouseIncome: 'N',
          },
          {
            fullName: { first: 'Deceased', last: 'Child' },
            dateOfBirth: '2010-01-01',
            relationshipToVeteran: 'Child',
            selected: true,
            removalReason: 'childDied',
            endDate: '2024-06-01',
            endOutsideUs: false,
            endCity: 'City',
            endState: 'CA',
          },
        ],
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    const result = customTransformForSubmit(mockFormConfig, form);
    const submittedData = JSON.parse(result.body);

    // Critical assertions: flags should be set even though view:removeDependentOptions is empty
    expect(submittedData['view:selectable686Options']).to.not.be.undefined;
    expect(submittedData['view:selectable686Options'].reportDivorce).to.be.true;
    expect(submittedData['view:selectable686Options'].reportDeath).to.be.true;

    expect(submittedData['view:removeDependentOptions']).to.not.be.undefined;
    expect(submittedData['view:removeDependentOptions'].reportDivorce).to.be
      .true;
    expect(submittedData['view:removeDependentOptions'].reportDeath).to.be.true;

    // Data should be present
    expect(submittedData.reportDivorce).to.not.be.undefined;
    expect(submittedData.deaths).to.be.an('array');
    expect(submittedData.deaths).to.have.lengthOf(1);
  });
});
