import { expect } from 'chai';
import { livingSituationSubmissionChoices } from '../../content/livingSituation';

import { getHomeless } from '../../utils/submit/homeless';
import { SC_NEW_FORM_DATA } from '../../constants';

describe('getHomeless', () => {
  const setup = ({
    toggle = true,
    homeless = true,
    situation = [],
    other = '',
    name = '',
    phone = '',
  } = {}) =>
    getHomeless({
      [SC_NEW_FORM_DATA]: toggle,
      housingRisk: homeless,
      livingSituation: {
        notRegular: situation[0],
        shelter: situation[1],
        friendOrFamily: situation[2],
        facility30Days: situation[3],
        home30Days: situation[4],
        other: situation[5],
      },
      otherHousingRisks: other,
      pointOfContactName: name,
      pointOfContactPhone: phone,
    });

  it('should return an empty object if not in new form flow', () => {
    expect(getHomeless({})).to.eql({});
    expect(getHomeless({ livingSituation: {} })).to.eql({});
    expect(setup({ toggle: false })).to.eql({});
    expect(setup({ toggle: false, homeless: true })).to.eql({});
  });

  it('should return an only homeless value', () => {
    expect(
      getHomeless({
        [SC_NEW_FORM_DATA]: true,
        housingRisk: true,
      }),
    ).to.eql({ homeless: true });
    expect(setup()).to.deep.equal({ homeless: true });
    expect(setup({ homeless: false })).to.deep.equal({ homeless: false });
    expect(setup({})).to.deep.equal({ homeless: true });
  });

  it('should return homeless and living situation', () => {
    expect(setup({ situation: [true] })).to.deep.equal({
      homeless: true,
      homelessLivingSituation: [livingSituationSubmissionChoices.notRegular],
    });
  });

  it('should return homeless and some living situation', () => {
    expect(
      setup({ situation: [false, true, false, true, false, true] }),
    ).to.deep.equal({
      homeless: true,
      homelessLivingSituation: [
        livingSituationSubmissionChoices.shelter,
        livingSituationSubmissionChoices.facility30Days,
        livingSituationSubmissionChoices.other,
      ],
    });
  });

  it('should return homeless and opposite living situation', () => {
    expect(
      setup({ situation: [true, false, true, false, true, false] }),
    ).to.deep.equal({
      homeless: true,
      homelessLivingSituation: [
        livingSituationSubmissionChoices.notRegular,
        livingSituationSubmissionChoices.friendOrFamily,
        livingSituationSubmissionChoices.home30Days,
      ],
    });
  });

  it('should return homeless and other living situation', () => {
    expect(
      setup({
        situation: [false, false, false, false, false, true],
        other: 'lorem ipsum',
      }),
    ).to.deep.equal({
      homeless: true,
      homelessLivingSituation: [livingSituationSubmissionChoices.other],
      homelessLivingSituationOther: 'lorem ipsum',
    });
  });

  it('should return homeless and point of contact', () => {
    expect(setup({ name: 'John Doe' })).to.deep.equal({
      homeless: true,
      homelessPointOfContact: 'John Doe',
    });
  });

  it('should return homeless, point of contact name & phone', () => {
    expect(setup({ name: 'John Doe', phone: '8005551212' })).to.deep.equal({
      homeless: true,
      homelessPointOfContact: 'John Doe',
      homelessPointOfContactPhone: {
        areaCode: '800',
        phoneNumber: '5551212',
      },
    });
  });

  it('should return all homeless related data', () => {
    expect(
      setup({
        situation: [true, true, true, true, true, true],
        other: 'lorem ipsum',
        name: 'John Doe',
        phone: '44-20-1234-5678901',
      }),
    ).to.deep.equal({
      homeless: true,
      homelessLivingSituation: [
        livingSituationSubmissionChoices.notRegular,
        livingSituationSubmissionChoices.shelter,
        livingSituationSubmissionChoices.friendOrFamily,
        livingSituationSubmissionChoices.facility30Days,
        livingSituationSubmissionChoices.home30Days,
        livingSituationSubmissionChoices.other,
      ],
      homelessLivingSituationOther: 'lorem ipsum',
      homelessPointOfContact: 'John Doe',
      homelessPointOfContactPhone: {
        areaCode: '442',
        phoneNumber: '012345678901',
      },
    });
  });
});
