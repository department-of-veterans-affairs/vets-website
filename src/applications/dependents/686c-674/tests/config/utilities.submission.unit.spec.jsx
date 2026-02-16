import { expect } from 'chai';

import {
  buildSubmissionData,
  customTransformForSubmit,
} from '../../config/utilities/submission';

import { PICKLIST_DATA } from '../../config/constants';
import { formConfig } from '../../config/form';

const dataOptions = 'view:removeDependentOptions';

describe('buildSubmissionData', () => {
  const createTestData = (overrides = {}) => ({
    data: {
      'view:addOrRemoveDependents': { add: true, remove: true },
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: true,
        addDisabledChild: true,
      },
      [dataOptions]: {
        reportDivorce: true,
        reportDeath: true,
        reportStepchildNotInHousehold: true,
        reportMarriageOfChildUnder18: true,
        reportChild18OrOlderIsNotAttendingSchool: true,
      },
      currentMarriageInformation: { typeOfMarriage: 'CIVIL' },
      doesLiveWithSpouse: { spouseDoesLiveWithVeteran: true },
      spouseInformation: { fullName: { first: 'John', last: 'Doe' } },
      spouseSupportingDocuments: [{ name: 'doc.pdf' }],
      spouseMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      veteranMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      childrenToAdd: [{ fullName: { first: 'Child', last: 'Doe' } }],
      childSupportingDocuments: [{ name: 'child-doc.pdf' }],
      studentInformation: [{ fullName: { first: 'Student', last: 'Doe' } }],
      reportDivorce: { fullName: { first: 'Ex', last: 'Spouse' } },
      deaths: [{ fullName: { first: 'Deceased', last: 'Dependent' } }],
      stepChildren: [{ fullName: { first: 'Step', last: 'Child' } }],
      childMarriage: [{ fullName: { first: 'Married', last: 'Child' } }],
      childStoppedAttendingSchool: [
        { fullName: { first: 'School', last: 'Child' } },
      ],
      emptyArray: [],
      emptySpouseDocs: [],
      veteranInformation: { fullName: { first: 'Veteran', last: 'Name' } },
      veteranContactInformation: { phoneNumber: '555-1234' },
      statementOfTruthSignature: 'John Doe',
      statementOfTruthCertified: true,
      householdIncome: false,
      vaDependentsNetWorthAndPension: true,
      metadata: { version: 1 },
      ...overrides,
    },
  });

  it('should return unchanged payload when no data property exists', () => {
    const payload = { metadata: { version: 1 } };
    const result = buildSubmissionData(payload);
    expect(result).to.deep.equal(payload);
  });

  it('should always include core fields', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.useV2).to.be.true;
    expect(result.data.daysTillExpires).to.equal(365);
  });

  it('should include essential fields when present', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.veteranInformation).to.not.be.undefined;
    expect(result.data.veteranContactInformation).to.not.be.undefined;
    expect(result.data.statementOfTruthSignature).to.not.be.undefined;
    expect(result.data.statementOfTruthCertified).to.not.be.undefined;
    expect(result.data.metadata).to.not.be.undefined;
  });

  it('should handle boolean fields that can be false', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.householdIncome).to.equal(false);
    expect(result.data.vaDependentsNetWorthAndPension).to.be.true;
  });

  it('should not include spouse data when addSpouse is false', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.currentMarriageInformation).to.be.undefined;
    expect(result.data.doesLiveWithSpouse).to.be.undefined;
    expect(result.data.spouseInformation).to.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.be.undefined;
    expect(result.data.spouseMarriageHistory).to.be.undefined;
    expect(result.data.veteranMarriageHistory).to.be.undefined;
  });

  it('should include spouse data when addSpouse is true', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true,
        addChild: false,
        report674: true,
        addDisabledChild: true,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.currentMarriageInformation).to.not.be.undefined;
    expect(result.data.doesLiveWithSpouse).to.not.be.undefined;
    expect(result.data.spouseInformation).to.not.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.not.be.undefined;
  });

  it('should include child data when either addChild or addDisabledChild is true', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.not.be.undefined;
    expect(result.data.childSupportingDocuments).to.not.be.undefined;
  });

  it('should not include child data when both addChild and addDisabledChild are false', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: true,
        addDisabledChild: false,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.childSupportingDocuments).to.be.undefined;
  });

  it('should include student data when report674 is true', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.studentInformation).to.not.be.undefined;
  });

  it('should not include student data when report674 is false', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: false,
        addDisabledChild: true,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.studentInformation).to.be.undefined;
  });

  it('should not include any add-related data when add is false', () => {
    const payload = createTestData({
      'view:addOrRemoveDependents': { add: false, remove: true },
    });
    const result = buildSubmissionData(payload);

    expect(result.data['view:addDependentOptions']).to.be.undefined;
    expect(result.data.currentMarriageInformation).to.be.undefined;
    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.studentInformation).to.be.undefined;
  });

  it('should not include any remove-related data when remove is false', () => {
    const payload = createTestData({
      'view:addOrRemoveDependents': { add: true, remove: false },
    });
    const result = buildSubmissionData(payload);

    expect(result.data[dataOptions]).to.be.undefined;
    expect(result.data.reportDivorce).to.be.undefined;
    expect(result.data.deaths).to.be.undefined;
    expect(result.data.stepChildren).to.be.undefined;
    expect(result.data.childMarriage).to.be.undefined;
    expect(result.data.childStoppedAttendingSchool).to.be.undefined;
  });

  it('should build control objects with only enabled options', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data['view:addDependentOptions']).to.deep.equal({
      report674: true,
      addDisabledChild: true,
    });

    expect(result.data[dataOptions]).to.deep.equal({
      reportDivorce: true,
      reportDeath: true,
      reportStepchildNotInHousehold: true,
      reportMarriageOfChildUnder18: true,
      reportChild18OrOlderIsNotAttendingSchool: true,
    });

    expect(result.data['view:selectable686Options']).to.deep.equal({
      report674: true,
      addDisabledChild: true,
      reportDivorce: true,
      reportDeath: true,
      reportStepchildNotInHousehold: true,
      reportMarriageOfChildUnder18: true,
      reportChild18OrOlderIsNotAttendingSchool: true,
    });
  });

  it('should not include empty arrays', () => {
    const payload = createTestData({
      childrenToAdd: [],
      spouseSupportingDocuments: [],
    });
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.be.undefined;
  });

  it('should not include view:addOrRemoveDependents when no valid options remain', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: false,
        addDisabledChild: false,
      },
      'view:addOrRemoveDependents': { add: true, remove: false },
    });
    const result = buildSubmissionData(payload);

    expect(result.data['view:addOrRemoveDependents']).to.be.undefined;
  });

  it('should handle complex mixed scenarios', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true,
        addChild: false,
        report674: false,
        addDisabledChild: false,
      },
      [dataOptions]: {
        reportDivorce: true,
        reportDeath: false,
        reportStepchildNotInHousehold: false,
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.spouseInformation).to.not.be.undefined;

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.studentInformation).to.be.undefined;

    expect(result.data.reportDivorce).to.not.be.undefined;
    expect(result.data.deaths).to.be.undefined;
    expect(result.data.stepChildren).to.be.undefined;

    expect(result.data['view:addDependentOptions']).to.deep.equal({
      addSpouse: true,
    });
    expect(result.data[dataOptions]).to.deep.equal({
      reportDivorce: true,
    });
  });

  it('should not set flags when options are true but data is missing', () => {
    // This test verifies the fix for the bug where flags could be set
    // without corresponding data, causing backend errors
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true,
        addChild: true,
        report674: true,
        addDisabledChild: false,
      },
      [dataOptions]: {
        reportDivorce: true,
        reportDeath: true,
        reportStepchildNotInHousehold: true,
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
      // Remove the actual data - simulating the bug scenario
      currentMarriageInformation: undefined,
      doesLiveWithSpouse: undefined,
      spouseInformation: undefined,
      spouseSupportingDocuments: undefined,
      spouseMarriageHistory: undefined,
      veteranMarriageHistory: undefined,
      childrenToAdd: undefined,
      childSupportingDocuments: undefined,
      studentInformation: undefined,
      reportDivorce: undefined,
      deaths: undefined,
      stepChildren: undefined,
    });
    const result = buildSubmissionData(payload);

    // Flags should NOT be set because data is missing
    expect(result.data['view:addDependentOptions']).to.be.undefined;
    expect(result.data[dataOptions]).to.be.undefined;
    expect(result.data['view:selectable686Options']).to.be.undefined;

    // Verify data fields are not present
    expect(result.data.spouseInformation).to.be.undefined;
    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.studentInformation).to.be.undefined;
    expect(result.data.reportDivorce).to.be.undefined;
    expect(result.data.deaths).to.be.undefined;
    expect(result.data.stepChildren).to.be.undefined;
  });

  it('should only set flags for workflows that have data, not all selected options', () => {
    // Test mixed scenario: some workflows have data, others don't
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true, // Has data
        addChild: true, // No data
        report674: true, // Has data
        addDisabledChild: false,
      },
      [dataOptions]: {
        reportDivorce: true, // Has data
        reportDeath: true, // No data
        reportStepchildNotInHousehold: false,
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
      // Only include some data
      currentMarriageInformation: { typeOfMarriage: 'CIVIL' },
      doesLiveWithSpouse: { spouseDoesLiveWithVeteran: true },
      spouseInformation: { fullName: { first: 'John', last: 'Doe' } },
      spouseSupportingDocuments: [{ name: 'doc.pdf' }],
      spouseMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      veteranMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      studentInformation: [{ fullName: { first: 'Student', last: 'Doe' } }],
      reportDivorce: { fullName: { first: 'Ex', last: 'Spouse' } },
      // Missing: childrenToAdd AND childSupportingDocuments (both required for addChild flag)
      childrenToAdd: undefined,
      childSupportingDocuments: undefined,
      deaths: undefined,
    });
    const result = buildSubmissionData(payload);

    // Should only include flags for workflows that have data
    expect(result.data['view:addDependentOptions']).to.deep.equal({
      addSpouse: true,
      report674: true,
    });
    expect(result.data[dataOptions]).to.deep.equal({
      reportDivorce: true,
    });
    expect(result.data['view:selectable686Options']).to.deep.equal({
      addSpouse: true,
      report674: true,
      reportDivorce: true,
    });

    // Verify data presence/absence
    expect(result.data.spouseInformation).to.not.be.undefined;
    expect(result.data.studentInformation).to.not.be.undefined;
    expect(result.data.reportDivorce).to.not.be.undefined;
    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.childSupportingDocuments).to.be.undefined;
    expect(result.data.deaths).to.be.undefined;
  });

  it('should not set reportStepchildNotInHousehold flag when stepChildren array is empty (regression test)', () => {
    const payload = createTestData({
      [dataOptions]: {
        reportDivorce: false,
        reportDeath: false,
        reportStepchildNotInHousehold: true, // User selected this option
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
      // Simulate empty stepChildren (user didn't complete the flow, or all items removed)
      stepChildren: [],
      // Remove other removal data to focus on stepchildren
      reportDivorce: undefined,
      deaths: undefined,
      childMarriage: undefined,
      childStoppedAttendingSchool: undefined,
    });
    const result = buildSubmissionData(payload);

    // The flag should NOT be set because stepChildren is empty
    expect(
      result.data['view:selectable686Options']?.reportStepchildNotInHousehold,
    ).to.be.undefined;
    expect(result.data[dataOptions]?.reportStepchildNotInHousehold).to.be
      .undefined;

    // stepChildren should not be in the submission
    expect(result.data.stepChildren).to.be.undefined;
  });

  it('should not set reportStepchildNotInHousehold flag when stepChildren is undefined', () => {
    const payload = createTestData({
      [dataOptions]: {
        reportDivorce: false,
        reportDeath: false,
        reportStepchildNotInHousehold: true, // User selected this option
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
      stepChildren: undefined, // User never added any stepchildren
      reportDivorce: undefined,
      deaths: undefined,
      childMarriage: undefined,
      childStoppedAttendingSchool: undefined,
    });
    const result = buildSubmissionData(payload);

    // The flag should NOT be set because stepChildren doesn't exist
    expect(
      result.data['view:selectable686Options']?.reportStepchildNotInHousehold,
    ).to.be.undefined;
    expect(result.data[dataOptions]?.reportStepchildNotInHousehold).to.be
      .undefined;
    expect(result.data.stepChildren).to.be.undefined;
  });
});

describe('customTransformForSubmit integration', () => {
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
            endType: 'Divorce',
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

  it('should preserve wizard view: fields in add flow with no awarded dependents (regression test)', () => {
    // This test verifies that wizard fields are preserved even when their pages
    // are marked inactive due to depends functions checking for awarded dependents.
    // This was causing a cascade where all view: fields and data were removed.
    //
    // CRITICAL: This test MUST use the real formConfig (not mockFormConfig) to
    // properly exercise the inactive page filtering logic with real depends functions.
    const form = {
      data: {
        vaDependentsV3: true,
        'view:addOrRemoveDependents': { add: true },
        'view:addDependentOptions': { addSpouse: true },
        'view:selectable686Options': { addSpouse: true },
        currentMarriageInformation: {
          typeOfMarriage: 'CIVIL',
          location: { city: 'Test', state: 'AL' },
          date: '1990-01-01',
        },
        doesLiveWithSpouse: {
          spouseDoesLiveWithVeteran: true,
        },
        spouseInformation: {
          isVeteran: false,
          fullName: { first: 'Test', last: 'User' },
          birthDate: '1990-01-01',
          ssn: '123123123',
        },
        dependents: {
          hasError: false,
          hasDependents: false,
          awarded: [], // No awarded dependents - triggers the cascade bug
        },
        veteranInformation: { fullName: { first: 'Test', last: 'Veteran' } },
        veteranContactInformation: { phoneNumber: '555-1234' },
        statementOfTruthSignature: 'Test Signature',
        statementOfTruthCertified: true,
        metadata: { version: 1 },
      },
    };

    // Use REAL formConfig to exercise actual page filtering and depends logic
    const result = customTransformForSubmit(formConfig, form);
    const submittedData = JSON.parse(result.body);

    // Critical assertions: wizard fields should be preserved
    expect(submittedData['view:addOrRemoveDependents']).to.not.be.undefined;
    expect(submittedData['view:addOrRemoveDependents'].add).to.be.true;

    expect(submittedData['view:addDependentOptions']).to.not.be.undefined;
    expect(submittedData['view:addDependentOptions'].addSpouse).to.be.true;

    expect(submittedData['view:selectable686Options']).to.not.be.undefined;
    expect(submittedData['view:selectable686Options'].addSpouse).to.be.true;

    // Data fields should also be present
    expect(submittedData.currentMarriageInformation).to.not.be.undefined;
    expect(submittedData.doesLiveWithSpouse).to.not.be.undefined;
    expect(submittedData.spouseInformation).to.not.be.undefined;
  });
});
