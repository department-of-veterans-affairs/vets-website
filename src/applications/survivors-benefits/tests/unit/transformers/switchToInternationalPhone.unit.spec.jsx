import { expect } from 'chai';
import { switchToInternationalPhone } from '../../../utils/transformers/switchToInternationalPhone';

describe('switchToInternationalPhone', () => {
  it('returns US contact string when countryCode is US', () => {
    const input = JSON.stringify({
      claimantPhone: {
        countryCode: 'US',
        contact: '123-456-7890',
      },
    });

    const result = JSON.parse(switchToInternationalPhone(input));
    expect(result).to.deep.equal({ claimantPhone: '123-456-7890' });
  });

  it('moves non-US phone to claimantInternationalPhone', () => {
    const input = JSON.stringify({
      claimantPhone: {
        countryCode: 'GB',
        callingCode: '44',
        contact: '20 7946 0958',
      },
    });

    const result = JSON.parse(switchToInternationalPhone(input));
    expect(result).to.deep.equal({
      claimantInternationalPhone: '+44-20 7946 0958',
    });
  });

  it('returns original data when claimantPhone is missing', () => {
    const payload = { claimantName: 'Jane Doe' };
    const result = JSON.parse(
      switchToInternationalPhone(JSON.stringify(payload)),
    );
    expect(result).to.deep.equal(payload);
  });
});
