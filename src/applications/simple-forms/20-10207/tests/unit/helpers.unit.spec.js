import { expect } from 'chai';

import { PREPARER_TYPES } from '../../config/constants';
import {
  getPreparerString,
  getPersonalInformationChapterTitle,
  getLivingSituationChapterTitle,
  getContactInfoChapterTitle,
  statementOfTruthFullNamePath,
} from '../../helpers';

describe('getPreparerString()', () => {
  it('returns correct string for preparerType', () => {
    expect(getPreparerString(PREPARER_TYPES.THIRD_PARTY_VETERAN)).to.equal(
      'Veteran’s',
    );
    expect(getPreparerString(PREPARER_TYPES.THIRD_PARTY_NON_VETERAN)).to.equal(
      'Claimant’s',
    );
    expect(getPreparerString(PREPARER_TYPES.VETERAN)).to.equal('Your');
    expect(getPreparerString(PREPARER_TYPES.NON_VETERAN)).to.equal('Your');
  });
});

describe('getPersonalInformationChapterTitle()', () => {
  const titleEnding = 'personal information';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getLivingSituationChapterTitle()', () => {
  const titleEnding = 'living situation';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getContactInfoChapterTitle()', () => {
  const titleEnding = 'contact information';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('statementOfTruthFullNamePath()', () => {
  it('returns correct path for preparerType', () => {
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.VETERAN },
      }),
    ).to.equal('veteranFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.NON_VETERAN },
      }),
    ).to.equal('nonVeteranFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN },
      }),
    ).to.equal('thirdPartyFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN },
      }),
    ).to.equal('thirdPartyFullName');
  });
});
