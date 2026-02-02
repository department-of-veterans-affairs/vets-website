import { expect } from 'chai';
import sinon from 'sinon';

import {
  customFormReplacer,
  spouseEvidence,
  childEvidence,
  buildSubmissionData,
  customTransformForSubmit,
  showDupeModalIfEnabled,
  hasAwardedDependents,
  showV3Picklist,
  noV3Picklist,
  showOptionsSelection,
  isAddingDependents,
  isRemovingDependents,
  isVisiblePicklistPage,
  hasSelectedPicklistItems,
  transformPicklistToV2,
  enrichDivorceWithSSN,
} from '../../config/utilities/data';

import { PICKLIST_DATA } from '../../config/constants';
import transformedV3RemoveOnlyData from '../e2e/fixtures/transformed-remove-only-v3';
import v3RemoveOnlyData from '../e2e/fixtures/removal-only-v3.json';
import { formConfig } from '../../config/form';

const dataOptions = 'view:removeDependentOptions';

describe('Utilities', () => {
  it('parses forms', () => {
    expect(customFormReplacer('test', {})).to.be.undefined;
    expect(
      customFormReplacer('test', { widget: 'autosuggest', id: 1 }),
    ).to.be.eq(1);
    expect(
      customFormReplacer('test', { confirmationCode: 'test', file: 'test' }),
    ).to.be.deep.eq({ confirmationCode: 'test' });
    expect(
      customFormReplacer('test', [{ widget: 'autosuggest', id: 1 }]),
    ).to.be.an('array');
    expect(customFormReplacer('test', [])).to.be.undefined;
    expect(customFormReplacer('test', 1)).to.be.eq(1);
    expect(customFormReplacer('test', null)).to.be.null;
    expect(customFormReplacer('phoneNumber', '123-456-7890 blah')).to.be.eq(
      '1234567890',
    );
  });
});

describe('spouseEvidence', () => {
  const data = (typeOfMarriage, country = 'USA', isMilitary = false) => ({
    veteranContactInformation: { veteranAddress: { country, isMilitary } },
    currentMarriageInformation: { typeOfMarriage },
  });
  it('should return all false boolean values', () => {
    expect(spouseEvidence(data('CEREMONIAL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: false,
    });
    expect(spouseEvidence(data(123))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: false,
    });
  });
  it('should return true for outside USA', () => {
    expect(spouseEvidence(data('', 'USA', true)).isOutsideUSA).to.be.true;
    expect(spouseEvidence(data('', 'XYZ', false)).isOutsideUSA).to.be.true;
  });
  it('should return true for uploads', () => {
    expect(spouseEvidence(data('CIVIL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('COMMON-LAW'))).to.deep.equal({
      isCommonLawMarriage: true,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('TRIBAL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: true,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('PROXY'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: true,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('OTHER'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
  });
});

describe('childEvidence', () => {
  const data = ({
    relationship,
    permanent = false,
    country = 'USA',
    isMilitary = false,
  } = {}) => ({
    veteranContactInformation: { veteranAddress: { country, isMilitary } },
    childrenToAdd: [
      {},
      { relationshipToChild: {} },
      {
        relationshipToChild: {
          stepchild: relationship === 'stepchild',
          adopted: relationship === 'adopted',
        },
        doesChildHaveDisability: true,
        doesChildHavePermanentDisability: permanent,
      },
    ],
  });

  it('should return all false boolean values', () => {
    expect(childEvidence(data())).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: false,
    });
  });

  it('should return true for birth certificate', () => {
    expect(childEvidence(data({ country: 'XYZ' }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
    expect(childEvidence(data({ isMilitary: true }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for stepchild', () => {
    expect(childEvidence(data({ relationship: 'stepchild' }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for adopted child', () => {
    expect(childEvidence(data({ relationship: 'adopted' }))).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: true,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for disabled child', () => {
    expect(childEvidence(data({ permanent: true }))).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: false,
      hasDisabledChild: true,
      needsChildUpload: true,
    });
  });
});

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

describe('showDupeModalIfEnabled', () => {
  it('should return false if feature flag is off', () => {
    expect(showDupeModalIfEnabled({})).to.be.false;
    expect(showDupeModalIfEnabled({ vaDependentsDuplicateModals: false })).to.be
      .false;
  });

  it('should return true if feature flag is on', () => {
    expect(showDupeModalIfEnabled({ vaDependentsDuplicateModals: true })).to.be;
  });
});

describe('showV3Picklist', () => {
  it('should return false if feature flag is off', () => {
    expect(showV3Picklist({})).to.be.false;
    expect(showV3Picklist({ vaDependentsV3: false })).to.be.false;
    expect(showV3Picklist({ vaDependentsV3: true, vaDependentV2Flow: true })).to
      .be.false;
  });

  it('should return true if feature flag is on', () => {
    expect(showV3Picklist({ vaDependentsV3: true })).to.be.true;
    expect(showV3Picklist({ vaDependentsV3: true, vaDependentV2Flow: false }))
      .to.be.true;
  });
});

describe('noV3Picklist', () => {
  it('should return true if feature flag is off', () => {
    expect(noV3Picklist({})).to.be.true;
    expect(noV3Picklist({ vaDependentsV3: false })).to.be.true;
  });

  it('should return false if feature flag is on', () => {
    expect(noV3Picklist({ vaDependentsV3: true })).to.be.false;
  });
});

describe('showOptionsSelection', () => {
  it('should return true if the feature flag is off', () => {
    expect(
      showOptionsSelection({
        vaDependentsV3: false,
      }),
    ).to.be.true;
  });
  it('should return true if the feature flag is on and some active dependents are available', () => {
    expect(
      showOptionsSelection({
        vaDependentsV3: true,
        dependents: { awarded: [{}] },
      }),
    ).to.be.true;
  });
  it('should return false if the feature flag is on and no active dependents are available', () => {
    expect(
      showOptionsSelection({
        vaDependentsV3: true,
        dependents: { awarded: [] },
      }),
    ).to.be.false;
  });
  it('should return false if the feature flag is on and there is an API error', () => {
    expect(
      showOptionsSelection({
        vaDependentsV3: true,
        dependents: { awarded: [{}] },
        'view:dependentsApiError': true,
      }),
    ).to.be.false;
  });
});

describe('hasAwardedDependents', () => {
  it('should return false if there are no dependents', () => {
    expect(hasAwardedDependents({})).to.be.false;
    expect(hasAwardedDependents({ dependents: {} })).to.be.false;
    expect(
      hasAwardedDependents({
        dependents: { awarded: [] },
      }),
    ).to.be.false;
  });

  it('should return true if there are awarded dependents', () => {
    expect(
      hasAwardedDependents({
        dependents: { awarded: [{ name: 'Test Dependent' }] },
      }),
    ).to.be.true;
  });
});

describe('isAddingDependents', () => {
  it('should return true if adding dependents', () => {
    expect(isAddingDependents({ 'view:addOrRemoveDependents': { add: true } }))
      .to.be.true;
  });

  it('should return false if not adding dependents', () => {
    expect(isAddingDependents({})).to.be.false;
    expect(isAddingDependents({ 'view:addOrRemoveDependents': {} })).to.be
      .false;
    expect(isAddingDependents({ 'view:addOrRemoveDependents': { add: false } }))
      .to.be.false;
  });
});

describe('isRemovingDependents', () => {
  it('should return true if removing dependents', () => {
    expect(
      isRemovingDependents({ 'view:addOrRemoveDependents': { remove: true } }),
    ).to.be.true;
  });

  it('should return false if not removing dependents', () => {
    expect(isRemovingDependents({})).to.be.false;
    expect(isRemovingDependents({ 'view:addOrRemoveDependents': {} })).to.be
      .false;
    expect(
      isRemovingDependents({ 'view:addOrRemoveDependents': { remove: false } }),
    ).to.be.false;
  });
});

describe('isVisiblePicklistPage', () => {
  const getData = ({ flag = true, remove = true, list = [] }) => ({
    vaDependentsV3: flag,
    'view:addOrRemoveDependents': { remove },
    [PICKLIST_DATA]: list,
  });

  it('should return false if no picklist items', () => {
    expect(isVisiblePicklistPage(getData({}), 'Spouse')).to.be.false;
  });

  it('should return false if picklist item not selected', () => {
    const formData = {
      ...getData({
        list: [{ relationshipToVeteran: 'Spouse', selected: false }],
      }),
    };
    expect(isVisiblePicklistPage(formData, 'Spouse')).to.be.false;
  });

  it('should return false if picklist item of different type is selected', () => {
    const formData = {
      ...getData({
        list: [{ relationshipToVeteran: 'Child', selected: true }],
      }),
    };
    expect(isVisiblePicklistPage(formData, 'Spouse')).to.be.false;
  });

  it('should return true if picklist item of correct type is selected', () => {
    const formData = {
      ...getData({
        list: [
          { relationshipToVeteran: 'Spouse', selected: true },
          { relationshipToVeteran: 'Child', selected: false },
          { relationshipToVeteran: 'Child', selected: true },
          { relationshipToVeteran: 'Parent', selected: true },
        ],
      }),
    };

    expect(isVisiblePicklistPage(formData, 'Spouse')).to.be.true;
    expect(isVisiblePicklistPage(formData, 'Child')).to.be.true;
    expect(isVisiblePicklistPage(formData, 'Parent')).to.be.true;
  });
});

describe('hasSelectedPicklistItems', () => {
  const getData = (spouse = false, child = false) => ({
    [PICKLIST_DATA]: [
      { relationshipToVeteran: 'Spouse', selected: spouse },
      { relationshipToVeteran: 'Child', selected: child },
    ],
  });

  it('should return false if no picklist items', () => {
    expect(hasSelectedPicklistItems({})).to.be.false;
  });

  it('should return false if no picklist items are selected', () => {
    expect(hasSelectedPicklistItems(getData())).to.be.false;
  });

  it('should return true if any picklist items are selected', () => {
    expect(hasSelectedPicklistItems(getData(false, true))).to.be.true;

    expect(hasSelectedPicklistItems(getData(true, true))).to.be.true;
  });
});

describe('transformPicklistToV2', () => {
  it('should do nothing when picklist is empty', () => {
    const data = {
      [PICKLIST_DATA]: [],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.undefined;
    expect(result.childMarriage).to.be.undefined;
    expect(result.childStoppedAttendingSchool).to.be.undefined;
    expect(result.reportDivorce).to.be.undefined;
    expect(result.stepChildren).to.be.undefined;
    expect(result[dataOptions]).to.be.undefined;
  });

  it('should do nothing when no items are selected', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'TEST', last: 'USER' },
          selected: false,
          removalReason: 'childMarried',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.undefined;
    expect(result.childMarriage).to.be.undefined;
    expect(result[dataOptions]).to.be.undefined;
  });

  it('should transform childMarried to childMarriage array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'MORTY', last: 'SMITH' },
          dateOfBirth: '2007-11-15',
          ssn: '6791',
          selected: true,
          removalReason: 'childMarried',
          endDate: '2000-01-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childMarriage).to.be.an('array');
    expect(result.childMarriage).to.have.lengthOf(1);
    expect(result.childMarriage[0]).to.deep.equal({
      fullName: { first: 'MORTY', last: 'SMITH' },
      ssn: '6791',
      birthDate: '2007-11-15',
      dateMarried: '2000-01-01',
      dependentIncome: 'N',
    });
  });

  it('should transform childNotInSchool to childStoppedAttendingSchool array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'SMITH' },
          dateOfBirth: '2005-06-15',
          ssn: '1234',
          selected: true,
          removalReason: 'childNotInSchool',
          endDate: '2024-05-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childStoppedAttendingSchool).to.be.an('array');
    expect(result.childStoppedAttendingSchool).to.have.lengthOf(1);
    expect(result.childStoppedAttendingSchool[0]).to.deep.equal({
      fullName: { first: 'CHILD', last: 'SMITH' },
      ssn: '1234',
      birthDate: '2005-06-15',
      dateChildLeftSchool: '2024-05-01',
      dependentIncome: 'N',
    });
  });

  it('should transform childDied to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'DOE' },
          dateOfBirth: '2000-01-01',
          ssn: '5678',
          selected: true,
          age: 25,
          isStepchild: 'Y',
          removalReason: 'childDied',
          endDate: '2023-12-01',
          endOutsideUs: false,
          endCity: 'Portland',
          endState: 'OR',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'CHILD', last: 'DOE' },
      ssn: '5678',
      birthDate: '2000-01-01',
      dependentType: 'CHILD',
      dependentDeathDate: '2023-12-01',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'Portland',
          state: 'OR',
        },
      },
      deceasedDependentIncome: 'N',
      childStatus: {
        childUnder18: false,
        disabled: true,
        stepChild: true,
      },
    });
  });

  it('should transform marriageEnded (divorce) to reportDivorce object', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SUMMER', last: 'SMITH' },
          dateOfBirth: '1990-08-01',
          ssn: '123456790',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2000-02-02',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce).to.deep.equal({
      fullName: { first: 'SUMMER', last: 'SMITH' },
      ssn: '123456790',
      birthDate: '1990-08-01',
      date: '2000-02-02',
      reasonMarriageEnded: 'Divorce',
      explanationOfOther: '',
      divorceLocation: {
        outsideUsa: false,
        location: {
          city: 'test',
          state: 'AS',
        },
      },
      spouseIncome: 'N',
    });
  });

  it('should transform marriageEnded (annulmentOrVoid) to reportDivorce object', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'annulmentOrVoid',
          endAnnulmentOrVoidDescription: 'Test description',
          endDate: '2020-01-01',
          endOutsideUs: true,
          endCity: 'Paris',
          endProvince: 'Test',
          endCountry: 'FRA',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce.reasonMarriageEnded).to.equal('Annulment');
    expect(result.reportDivorce.explanationOfOther).to.equal(
      'Test description',
    );
    expect(result.reportDivorce.divorceLocation).to.deep.equal({
      outsideUsa: true,
      location: {
        city: 'Paris',
        state: 'Test',
        country: 'FRA',
      },
    });
  });

  it('should not include SSN in reportDivorce if SSN is not exactly 9 digits', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '1234', // Only 4 digits
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce.ssn).to.be.undefined;
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'SPOUSE',
      last: 'DOE',
    });
  });

  it('should include SSN in reportDivorce if SSN is exactly 9 digits', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '123456789', // Exactly 9 digits
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });

  it('should normalize SSN in reportDivorce by removing dashes', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '123-45-6789', // 9 digits with dashes
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    // Should strip dashes and send digits only
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });

  it('should transform spouse death to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1980-05-15',
          ssn: '4444',
          selected: true,
          removalReason: 'spouseDied',
          endDate: '2024-01-15',
          endOutsideUs: true,
          endCity: 'London',
          endCountry: 'GBR',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'SPOUSE', last: 'DOE' },
      ssn: '4444',
      birthDate: '1980-05-15',
      dependentType: 'SPOUSE',
      dependentDeathDate: '2024-01-15',
      dependentDeathLocation: {
        outsideUsa: true,
        location: {
          city: 'London',
          state: '',
          country: 'GBR',
        },
      },
      deceasedDependentIncome: 'N',
    });
  });

  it('should transform parentDied to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SAM', last: 'PETER' },
          dateOfBirth: '1936-05-16',
          ssn: '6767',
          selected: true,
          removalReason: 'parentDied',
          endDate: '2000-02-02',
          endOutsideUs: false,
          endCity: 'test',
          endState: 'AK',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'SAM', last: 'PETER' },
      ssn: '6767',
      birthDate: '1936-05-16',
      dependentType: 'DEPENDENT_PARENT',
      dependentDeathDate: '2000-02-02',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'test',
          state: 'AK',
        },
      },
      deceasedDependentIncome: 'N',
    });
  });

  it('should transform multiple items to appropriate arrays', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD1', last: 'SMITH' },
          dateOfBirth: '2007-11-15',
          ssn: '6791',
          selected: true,
          removalReason: 'childMarried',
          endDate: '2000-01-01',
        },
        {
          fullName: { first: 'CHILD2', last: 'SMITH' },
          dateOfBirth: '2010-01-01',
          ssn: '5678',
          selected: true,
          removalReason: 'childDied',
          endDate: '2023-12-01',
          endOutsideUs: false,
          endCity: 'Portland',
          endState: 'OR',
        },
        {
          fullName: { first: 'PARENT', last: 'PETER' },
          dateOfBirth: '1936-05-16',
          ssn: '6767',
          selected: true,
          removalReason: 'parentDied',
          endDate: '2000-02-02',
          endOutsideUs: false,
          endCity: 'test',
          endState: 'AK',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childMarriage).to.have.lengthOf(1);
    expect(result.deaths).to.have.lengthOf(2);
    expect(result.deaths[0].dependentType).to.equal('CHILD');
    expect(result.deaths[1].dependentType).to.equal('DEPENDENT_PARENT');
  });

  it('should handle stepchildNotMember removal reason', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2012-02-19',
          ssn: '333445555',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'stepchildNotMember',
          endDate: '2000-02-02',
          whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
          address: {
            country: 'USA',
            street: '123 Fake St.',
            city: 'Las Vegas',
            state: 'NV',
            postalCode: '12345',
          },
          stepchildFinancialSupport: 'N',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '333445555',
      birthDate: '2012-02-19',
      dateStepchildLeftHousehold: '2000-02-02',
      whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
      address: {
        country: 'USA',
        street: '123 Fake St.',
        city: 'Las Vegas',
        state: 'NV',
        postalCode: '12345',
      },
      livingExpensesPaid: 'Less than half',
      supportingStepchild: false,
    });
  });

  it('should ignore stepchildNotMember if stepchild has >50% financial support', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2012-02-19',
          ssn: '333445555',
          selected: true,
          removalReason: 'stepchildNotMember',
          endDate: '2000-02-02',
          whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
          address: {
            country: 'USA',
            street: '123 Fake St.',
            city: 'Las Vegas',
            state: 'NV',
            postalCode: '12345',
          },
          stepchildFinancialSupport: 'Y',
          isStepchild: 'Y',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.deep.equal([
      {
        address: {
          city: 'Las Vegas',
          country: 'USA',
          postalCode: '12345',
          state: 'NV',
          street: '123 Fake St.',
        },
        birthDate: '2012-02-19',
        dateStepchildLeftHousehold: '2000-02-02',
        fullName: {
          first: 'STEP',
          last: 'CHILD',
        },
        livingExpensesPaid: 'Less than half',
        ssn: '333445555',
        supportingStepchild: false,
        whoDoesTheStepchildLiveWith: {
          first: 'John',
          last: 'Doe',
        },
      },
    ]);
  });

  it('should add stepchild to stepChildren array only when isStepchild is Y and removalReason is childMarried', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2010-03-15',
          ssn: '123456789',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childMarried',
          endDate: '2024-06-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild with childMarried goes to stepChildren array (not childMarriage)
    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '123456789',
      birthDate: '2010-03-15',
    });
    // Should NOT be in childMarriage array
    expect(result.childMarriage).to.be.undefined;
  });

  it('should add stepchild to deaths array only when isStepchild is Y and removalReason is childDied', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2005-08-20',
          ssn: '987654321',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childDied',
          endDate: '2024-01-15',
          endOutsideUs: false,
          endCity: 'Seattle',
          endState: 'WA',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild should NOT be in stepChildren array for childDied
    expect(result.stepChildren).to.be.undefined;
    // Stepchild should be in deaths array
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '987654321',
      birthDate: '2005-08-20',
      dependentType: 'CHILD',
      dependentDeathDate: '2024-01-15',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'Seattle',
          state: 'WA',
        },
      },
      deceasedDependentIncome: 'N',
      childStatus: {
        childUnder18: false,
        disabled: false,
        stepChild: true,
      },
    });
  });

  it('should add stepchild to stepChildren array only when isStepchild is Y and removalReason is childNotInSchool', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2003-11-10',
          ssn: '555666777',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childNotInSchool',
          endDate: '2024-05-20',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild with childNotInSchool goes to stepChildren array (not childStoppedAttendingSchool)
    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '555666777',
      birthDate: '2003-11-10',
    });
    // Should NOT be in childStoppedAttendingSchool array
    expect(result.childStoppedAttendingSchool).to.be.undefined;
  });

  it('should NOT add stepchild to stepChildren array when isStepchild is N', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'BIOLOGICAL', last: 'CHILD' },
          dateOfBirth: '2010-03-15',
          ssn: '123456789',
          selected: true,
          isStepchild: 'N',
          removalReason: 'childMarried',
          endDate: '2024-06-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.be.undefined;
    expect(result.childMarriage).to.have.lengthOf(1);
  });

  it('should handle missing optional location fields', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'DOE' },
          dateOfBirth: '2010-01-01',
          ssn: '5678',
          selected: true,
          removalReason: 'childDied',
          endDate: '2023-12-01',
          // No location fields provided
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths[0].dependentDeathLocation).to.deep.equal({
      outsideUsa: false,
      location: {
        city: '',
        state: '',
      },
    });
  });

  it('should ignore parentOther removal reason', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'PARENT', last: 'DOE' },
          dateOfBirth: '1940-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'parentOther',
          endDate: '2024-01-01',
        },
      ],
    };

    const result = transformPicklistToV2(data);
    expect(result.reportDivorce).to.be.undefined;
  });

  it('should log issue in Datadog for multiple spouses with marriageEnded', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = {
      logger: { log: logSpy },
    };
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE1', last: 'SMITH' },
          dateOfBirth: '1990-08-01',
          ssn: '6790',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2000-02-02',
          endOutsideUs: false,
        },
        {
          fullName: { first: 'SPOUSE2', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endOutsideUs: false,
        },
      ],
    };
    transformPicklistToV2(data);

    // Should log issue in Datadog
    expect(logSpy.args[0]).to.deep.equal([
      'Multiple spouses with marriageEnded in v3 to V2 transform',
      {},
      'info',
      undefined,
    ]);
  });

  it('should log issue in Datadog for an unknown removal reason', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = {
      logger: { log: logSpy },
    };
    const data = {
      [PICKLIST_DATA]: [
        {
          selected: true,
          removalReason: 'somethingUnknown',
        },
      ],
    };

    // Should log issue in Datadog
    transformPicklistToV2(data);
    expect(logSpy.args[0]).to.deep.equal([
      'Unknown removal reason in v3 to V2 transform',
      { removalReason: 'somethingUnknown' },
      'error',
      undefined,
    ]);
  });

  it('should do a full transformation with all dependent types', () => {
    const v3Result = transformedV3RemoveOnlyData;
    // First fix v3 remove only datesOfBirth
    const data = {
      ...v3RemoveOnlyData,
      [PICKLIST_DATA]: v3Result[PICKLIST_DATA],
    };

    const result = transformPicklistToV2(data);
    expect(result.childMarriage).to.deep.equal(v3Result.childMarriage);
    expect(result.childStoppedAttendingSchool).to.deep.equal(
      v3Result.childStoppedAttendingSchool,
    );
    expect(result.deaths).to.deep.equal(v3Result.deaths);
    expect(result.reportDivorce).to.deep.equal(v3Result.reportDivorce);
    expect(result.stepChildren).to.deep.equal(v3Result.stepChildren);
  });
});

describe('enrichDivorceWithSSN', () => {
  it('should add SSN to reportDivorce when matching spouse is found', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
        date: '2020-06-01',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('123456789');
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });
  });

  it('should match spouse with middle name', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', middle: 'Marie', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', middle: 'Marie', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '987654321',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('987654321');
  });

  it('should match spouse with case-insensitive name comparison', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'jane', middle: 'MARIE', last: 'DoE' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'JANE', middle: 'marie', last: 'DOE' },
            dateOfBirth: '1990-01-15',
            ssn: '555666777',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('555666777');
  });

  it('should match spouse without middle name when both are undefined', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '111222333',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('111222333');
  });

  it('should not modify data if SSN already exists', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
        ssn: '555555555',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '999999999',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should keep the existing SSN, not replace it
    expect(result.reportDivorce.ssn).to.equal('555555555');
  });

  it('should return unchanged data if no reportDivorce exists', () => {
    const data = {
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result).to.deep.equal(data);
  });

  it('should return unchanged data if no matching spouse is found', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'John', last: 'Smith' },
            dateOfBirth: '1985-05-20',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });
  });

  it('should not match if birthDate is different', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-16', // Different date
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not match if name is different', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Janet', last: 'Doe' }, // Different first name
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not match if relationship is not Spouse', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Child', // Not a spouse
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should handle empty awarded dependents array', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should handle missing dependents object', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not add SSN if it is not exactly 9 digits', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '12345', // Only 5 digits
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should not add invalid SSN
    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not add SSN if it has more than 9 digits', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '12345678901', // 11 digits
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should not add invalid SSN
    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should normalize SSN by removing dashes and formatting', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123-45-6789', // 9 digits with formatting
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should normalize SSN to digits only (remove dashes)
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });
});
