import { expect } from 'chai';

import {
  customFormReplacer,
  spouseEvidence,
  childEvidence,
  showDupeModalIfEnabled,
  hasAwardedDependents,
  showV3Picklist,
  noV3Picklist,
  showOptionsSelection,
  isAddingDependents,
  isRemovingDependents,
  isVisiblePicklistPage,
  hasSelectedPicklistItems,
} from '../../config/utilities/formHelpers';

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
