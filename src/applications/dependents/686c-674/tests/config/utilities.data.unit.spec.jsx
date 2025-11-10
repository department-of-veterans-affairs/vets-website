import { expect } from 'chai';

import {
  customFormReplacer,
  validateName,
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
} from '../../config/utilities/data';

import { PICKLIST_DATA } from '../../config/constants';

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
  });
});

describe('validateName', () => {
  it('should validate the name', () => {
    const response1 = validateName(
      { first: false, last: false },
      { first: 'Bob', last: 'Last' },
    );
    expect(response1).to.be.undefined;
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
  const createTestData = (overrides = {}) => {
    const defaults = {
      'view:addOrRemoveDependents': { add: true, remove: true },
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: true,
        addDisabledChild: true,
      },
      'view:removeDependentOptions': {
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
    };

    const merged = { ...defaults, ...overrides };

    const addOptions = merged['view:addDependentOptions'] || {};
    const removeOptions = merged['view:removeDependentOptions'] || {};
    merged['view:selectable686Options'] = {
      ...addOptions,
      ...removeOptions,
    };

    return { data: merged };
  };

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

    expect(result.data['view:removeDependentOptions']).to.be.undefined;
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

    expect(result.data['view:removeDependentOptions']).to.deep.equal({
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
      'view:removeDependentOptions': {
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
    expect(result.data['view:removeDependentOptions']).to.deep.equal({
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
  });

  it('should return true if feature flag is on', () => {
    expect(showV3Picklist({ vaDependentsV3: true })).to.be.true;
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
