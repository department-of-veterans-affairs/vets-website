import { expect } from 'chai';
import {
  claimantAddressTitle,
  claimantContactInformationTitle,
  claimantIsChild,
  claimantIsNotVeteran,
  claimantIsParent,
  claimantIsSpouse,
  claimantIsVeteran,
  claimantPersonalInformationTitle,
  claimantSsnTitle,
  getClaimantIdentificationText,
} from '../../config/helpers';

describe('helper functions', () => {
  it('provides the correct information for a veteran', () => {
    const formData = {
      claimantIdentification: 'VETERAN',
    };

    expect(claimantIsVeteran({ formData })).to.equal(true);
    expect(claimantIsSpouse({ formData })).to.equal(false);
    expect(claimantIsParent({ formData })).to.equal(false);
    expect(claimantIsChild({ formData })).to.equal(false);
    expect(claimantIsNotVeteran({ formData })).to.equal(false);
    expect(getClaimantIdentificationText(formData)).to.match(/veteran/i);
    expect(claimantPersonalInformationTitle({ formData })).to.match(/veteran/i);
    expect(claimantSsnTitle({ formData })).to.match(/veteran/i);
    expect(claimantAddressTitle({ formData })).to.match(/veteran/i);
    expect(claimantContactInformationTitle({ formData })).to.match(/veteran/i);
  });

  it('provides the correct information for a spouse', () => {
    const formData = {
      claimantIdentification: 'SPOUSE',
    };

    expect(claimantIsVeteran({ formData })).to.equal(false);
    expect(claimantIsSpouse({ formData })).to.equal(true);
    expect(claimantIsParent({ formData })).to.equal(false);
    expect(claimantIsChild({ formData })).to.equal(false);
    expect(claimantIsNotVeteran({ formData })).to.equal(true);
    expect(getClaimantIdentificationText(formData)).to.match(/spouse/i);
    expect(claimantPersonalInformationTitle({ formData })).to.match(/spouse/i);
    expect(claimantSsnTitle({ formData })).to.match(/spouse/i);
    expect(claimantAddressTitle({ formData })).to.match(/spouse/i);
    expect(claimantContactInformationTitle({ formData })).to.match(/spouse/i);
  });

  it('provides the correct information for a parent', () => {
    const formData = {
      claimantIdentification: 'PARENT',
    };

    expect(claimantIsVeteran({ formData })).to.equal(false);
    expect(claimantIsSpouse({ formData })).to.equal(false);
    expect(claimantIsParent({ formData })).to.equal(true);
    expect(claimantIsChild({ formData })).to.equal(false);
    expect(claimantIsNotVeteran({ formData })).to.equal(true);
    expect(getClaimantIdentificationText(formData)).to.match(/parent/i);
    expect(claimantPersonalInformationTitle({ formData })).to.match(/parent/i);
    expect(claimantSsnTitle({ formData })).to.match(/parent/i);
    expect(claimantAddressTitle({ formData })).to.match(/parent/i);
    expect(claimantContactInformationTitle({ formData })).to.match(/parent/i);
  });

  it('provides the correct information for a child', () => {
    const formData = {
      claimantIdentification: 'CHILD',
    };

    expect(claimantIsVeteran({ formData })).to.equal(false);
    expect(claimantIsSpouse({ formData })).to.equal(false);
    expect(claimantIsParent({ formData })).to.equal(false);
    expect(claimantIsChild({ formData })).to.equal(true);
    expect(claimantIsNotVeteran({ formData })).to.equal(true);
    expect(getClaimantIdentificationText(formData)).to.match(/child/i);
    expect(claimantPersonalInformationTitle({ formData })).to.match(/child/i);
    expect(claimantSsnTitle({ formData })).to.match(/child/i);
    expect(claimantAddressTitle({ formData })).to.match(/child/i);
    expect(claimantContactInformationTitle({ formData })).to.match(/child/i);
  });
});
