import { expect } from 'chai';
import { formatContactInfo } from '../utilities/formatContactInfo';

describe('formatContactInfo', () => {
  it('should format contact information correctly', async () => {
    const poaAttributes = {
      addressLine1: '1608 K St NW',
      addressLine2: '',
      addressLine3: '',
      city: 'Washington',
      stateCode: 'DC',
      zipCode: '20006',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '202-861-2700 ext 123',
    };

    const result = await formatContactInfo(poaAttributes);

    expect(result.concatAddress).to.equal('1608 K St NW Washington, DC 20006');
    expect(result.contact).to.equal('2028612700');
    expect(result.extension).to.equal('123');
    expect(result.vcfUrl).to.not.be.null;
  });
});
