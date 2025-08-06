import { expect } from 'chai';
import {
  createNoDescriptionText,
  createVAPharmacyText,
} from '../../../util/helpers';

describe('createNoDescriptionText', () => {
  it('should include a phone number if provided', () => {
    expect(createNoDescriptionText('555-111-5555')).to.eq(
      'No description available. If you need help identifying this medication, call your pharmacy at 555-111-5555.',
    );
  });

  it('should create a string even if no phone number provided', () => {
    expect(createNoDescriptionText()).to.eq(
      'No description available. If you need help identifying this medication, call your pharmacy.',
    );
  });

  describe('createVAPharmacyText', () => {
    it('should include a phone number if provided', () => {
      expect(createVAPharmacyText('555-111-5555')).to.eq(
        'your VA pharmacy at 555-111-5555',
      );
    });

    it('should create a string even if no phone number provided', () => {
      expect(createVAPharmacyText()).to.eq('your VA pharmacy');
    });
  });
});
