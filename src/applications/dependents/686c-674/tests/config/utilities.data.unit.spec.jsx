import { expect } from 'chai';
import sinon from 'sinon';

import {
  customFormReplacer,
  spouseEvidence,
  childEvidence,
  buildSubmissionData,
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
} from '../../config/utilities/data';

import { PICKLIST_DATA } from '../../config/constants';
import transformedV3RemoveOnlyData from '../e2e/fixtures/transformed-remove-only-v3';
import v3RemoveOnlyData from '../e2e/fixtures/removal-only-v3.json';

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
});

describe('showDupeModalIfEnabled', () => {
  it('should return false if feature flag is off', () => {
    expect(showDupeModalIfEnabled({})).to.be.false;
    expect(showDupeModalIfEnabled({ vaDependentsDuplicateModals: false })).to.be
      .false;
  });

  it('should return true if feature flag is on', () => {
    expect(showDupeModalIfEnabled({ vaDependentsDuplicateModals: true })).to.be
      .true;
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
    expect(data[dataOptions].reportMarriageOfChildUnder18).to.be.true;
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
    expect(result[dataOptions].reportChild18OrOlderIsNotAttendingSchool).to.be
      .true;
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
    expect(result[dataOptions].reportDeath).to.be.true;
  });

  it('should transform marriageEnded (divorce) to reportDivorce object', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SUMMER', last: 'SMITH' },
          dateOfBirth: '1990-08-01',
          ssn: '6790',
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
      ssn: '6790',
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
    expect(result[dataOptions].reportDivorce).to.be.true;
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
    expect(result[dataOptions].reportDeath).to.be.true;
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
    expect(data[dataOptions].reportDeath).to.be.true;
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

    expect(result[dataOptions]).to.deep.equal({
      reportDivorce: false,
      reportDeath: true,
      reportStepchildNotInHousehold: false,
      reportMarriageOfChildUnder18: true,
      reportChild18OrOlderIsNotAttendingSchool: false,
    });
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
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.true;
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

    expect(result.stepChildren).to.be.undefined;
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.false;
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
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.true;
    expect(result[dataOptions].reportMarriageOfChildUnder18).to.be.false;
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
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.false;
    expect(result[dataOptions].reportDeath).to.be.true;
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
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.true;
    expect(result[dataOptions].reportChild18OrOlderIsNotAttendingSchool).to.be
      .false;
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
    expect(result[dataOptions].reportStepchildNotInHousehold).to.be.false;
    expect(result[dataOptions].reportMarriageOfChildUnder18).to.be.true;
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
    expect(result[dataOptions].reportDivorce).to.be.false;
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
    expect(result[dataOptions]).to.deep.equal(v3Result[dataOptions]);
    expect(result['view:selectable686Options']).to.deep.equal(
      v3Result['view:selectable686Options'],
    );
    expect(result['view:addDependentOptions']).to.deep.equal(
      v3Result['view:addDependentOptions'],
    );
    expect(result['view:removeDependentOptions']).to.deep.equal(
      v3Result['view:removeDependentOptions'],
    );
  });
});
