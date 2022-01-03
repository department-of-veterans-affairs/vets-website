import { expect } from 'chai';

import {
  formatPronouns,
  formatGenderIdentity,
  formatSexualOrientation,
} from '@@profile/util/personal-information/personalInformationUtils';

describe('formatPronouns utility', () => {
  it('returns single pronouns', () => {
    expect(formatPronouns(['heHimHis'])).to.equal('He/him/his');
  });

  it('returns comma separated pronouns', () => {
    expect(formatPronouns(['heHimHis', 'theyThemTheirs'])).to.equal(
      'He/him/his, They/them/theirs',
    );
  });

  it('returns pronounsNotListed pronouns', () => {
    expect(formatPronouns(['pronounsNotListed'], 'custom pronouns')).to.equal(
      'custom pronouns',
    );
  });

  it('returns comma separated list including pronounsNotListedText', () => {
    expect(
      formatPronouns(['heHimHis', 'pronounsNotListed'], 'custom pronouns'),
    ).to.equal('He/him/his, custom pronouns');
  });

  it('throws error when no pronounsNotListedText is passed and pronounsNotListed is in array of selected pronouns', () => {
    expect(() => formatPronouns(['pronounsNotListed'])).to.throw(
      'pronounsNotListedText must be provided if pronounsNotListed is in selected pronouns array',
    );
  });
});

describe('formatGenderIdentity utility', () => {
  it('returns single genders', () => {
    expect(formatGenderIdentity('woman')).to.equal('Woman');
    expect(formatGenderIdentity('man')).to.equal('Man');
    expect(formatGenderIdentity('transgenderWoman')).to.equal(
      'Transgender woman',
    );
    expect(formatGenderIdentity('transgenderMan')).to.equal('Transgender man');
    expect(formatGenderIdentity('preferNotToAnswer')).to.equal(
      'Prefer not to answer',
    );
    expect(formatGenderIdentity('genderNotListed')).to.equal(
      'A gender not listed here',
    );
  });
});

describe('formatSexualOrientation utility', () => {
  it('returns single sexualOrientations', () => {
    expect(formatSexualOrientation('lesbianGayHomosexual')).to.equal(
      'Lesbian, gay, or homosexual',
    );
    expect(formatSexualOrientation('straightOrHeterosexual')).to.equal(
      'Straight or heterosexual',
    );
    expect(formatSexualOrientation('bisexual')).to.equal('Bisexual');
    expect(formatSexualOrientation('queer')).to.equal('Queer');
    expect(formatSexualOrientation('dontKnow')).to.equal('Don’t know');
    expect(formatSexualOrientation('preferNotToAnswer')).to.equal(
      'Prefer not to answer',
    );
    expect(
      formatSexualOrientation(
        'sexualOrientationNotListed',
        'other sexual orientation',
      ),
    ).to.equal('other sexual orientation');
  });

  it('throws error when no sexualOrientationNotListedText is passed and sexualOrientationNotListed is passed', () => {
    expect(() =>
      formatSexualOrientation('sexualOrientationNotListed'),
    ).to.throw(
      'sexualOrientationNotListedText must be provided if sexualOrientationNotListed is selected',
    );
  });
});
