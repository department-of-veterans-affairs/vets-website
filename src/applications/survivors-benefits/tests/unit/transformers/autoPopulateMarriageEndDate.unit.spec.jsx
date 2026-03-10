import { expect } from 'chai';
import { autoPopulateMarriageEndDate } from '../../../utils/transformers/autoPopulateMarriageEndDate';

describe('autoPopulateMarriageEndDate', () => {
  it('should populate marriageToVeteranEndDate with veteranDateOfDeath when married at time of death', () => {
    const input = JSON.stringify({
      marriedToVeteranAtTimeOfDeath: true,
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result).to.deep.equal({
      marriedToVeteranAtTimeOfDeath: true,
      veteranDateOfDeath: '2024-03-15',
      marriageToVeteranEndDate: '2024-03-15',
      claimantName: 'Jane Doe',
    });
  });

  it('should not populate marriageToVeteranEndDate when not married at time of death', () => {
    const input = JSON.stringify({
      marriedToVeteranAtTimeOfDeath: false,
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result).to.deep.equal({
      marriedToVeteranAtTimeOfDeath: false,
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
    });
  });

  it('should not populate marriageToVeteranEndDate when veteranDateOfDeath is missing', () => {
    const input = JSON.stringify({
      marriedToVeteranAtTimeOfDeath: true,
      claimantName: 'Jane Doe',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result).to.deep.equal({
      marriedToVeteranAtTimeOfDeath: true,
      claimantName: 'Jane Doe',
    });
  });

  it('should return original data when marriedToVeteranAtTimeOfDeath is undefined', () => {
    const input = JSON.stringify({
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result).to.deep.equal({
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
    });
  });

  it('should preserve all existing form data when populating marriageToVeteranEndDate', () => {
    const input = JSON.stringify({
      marriedToVeteranAtTimeOfDeath: true,
      veteranDateOfDeath: '2024-03-15',
      claimantName: 'Jane Doe',
      claimantPhone: '555-1234',
      veteranName: 'John Doe',
      veteranSsn: '123-45-6789',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result).to.deep.equal({
      marriedToVeteranAtTimeOfDeath: true,
      veteranDateOfDeath: '2024-03-15',
      marriageToVeteranEndDate: '2024-03-15',
      claimantName: 'Jane Doe',
      claimantPhone: '555-1234',
      veteranName: 'John Doe',
      veteranSsn: '123-45-6789',
    });
  });

  it('should not overwrite existing marriageToVeteranEndDate when conditions are not met', () => {
    const input = JSON.stringify({
      marriedToVeteranAtTimeOfDeath: false,
      veteranDateOfDeath: '2024-03-15',
      marriageToVeteranEndDate: '2023-01-01',
    });

    const result = JSON.parse(autoPopulateMarriageEndDate(input));
    expect(result.marriageToVeteranEndDate).to.equal('2023-01-01');
  });
});
