import { expect } from 'chai';

import { getThirdPartyName } from '../helpers';

describe('10278 helpers - getThirdPartyName', () => {
  it('returns organization name when authorize is "organization"', () => {
    const formData = {
      discloseInformation: { authorize: 'organization' },
      thirdPartyOrganizationInformation: {
        organizationName: 'Acme Org',
      },
    };

    expect(getThirdPartyName(formData)).to.equal('Acme Org');
  });

  it('returns person full name when authorize is "person"', () => {
    const formData = {
      discloseInformation: { authorize: 'person' },
      thirdPartyPersonName: {
        fullName: {
          first: 'Jane',
          last: 'Doe',
        },
      },
    };

    expect(getThirdPartyName(formData)).to.equal('Jane Doe');
  });

  it('falls back to "the third party" for other cases', () => {
    expect(getThirdPartyName({})).to.equal('the third party');
    expect(getThirdPartyName(undefined)).to.equal('the third party');
    expect(
      getThirdPartyName({
        discloseInformation: { authorize: 'other' },
      }),
    ).to.equal('the third party');
  });
});
