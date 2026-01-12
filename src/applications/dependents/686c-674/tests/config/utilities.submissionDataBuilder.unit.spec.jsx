import { expect } from 'chai';

import { buildSubmissionData } from '../../config/utilities/submissionDataBuilder';

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
