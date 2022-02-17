import { expect } from 'chai';

import { formatMultiSelectAndText } from '@@profile/util/personal-information/personalInformationUtils';

describe('formatMultiSelectAndText utility', () => {
  it('returns single pronouns', () => {
    expect(
      formatMultiSelectAndText({ pronouns: ['heHimHis'] }, 'pronouns'),
    ).to.equal('He/him/his');
  });

  it('returns comma separated pronouns', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: ['heHimHis', 'theyThemTheirs'] },
        'pronouns',
      ),
    ).to.equal('He/him/his, They/them/theirs');
  });

  it('returns pronounsNotListedText value', () => {
    expect(
      formatMultiSelectAndText(
        { pronounsNotListedText: 'custom pronouns' },
        'pronouns',
      ),
    ).to.equal('custom pronouns');
  });

  it('returns comma separated list including pronounsNotListedText', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: ['heHimHis'], pronounsNotListedText: 'custom pronouns' },
        'pronouns',
      ),
    ).to.equal('He/him/his, custom pronouns');
  });

  it('returns null if fields do not have values', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: [], pronounsNotListedText: '' },
        'pronouns',
      ),
    ).to.be.null;
  });
});
