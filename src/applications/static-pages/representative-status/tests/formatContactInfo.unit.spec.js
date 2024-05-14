import { expect } from 'chai';
import sinon from 'sinon';
import { formatContactInfo } from '../utilities/formatContactInfo';

describe('formatContactInfo', () => {
  let originalBlob;
  let createObjectURLStub;

  before(() => {
    originalBlob = global.Blob;

    global.Blob = sinon
      .stub()
      .callsFake((content, options) => ({ content, options }));

    createObjectURLStub = sinon
      .stub(URL, 'createObjectURL')
      .returns('mocked_vcf_url');
  });

  after(() => {
    global.Blob = originalBlob;

    createObjectURLStub.restore();
  });

  it('should format contact information correctly', () => {
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

    const result = formatContactInfo(poaAttributes);

    expect(result.concatAddress).to.equal('1608 K St NW Washington, DC 20006');
    expect(result.contact).to.equal('2028612700');
    expect(result.extension).to.equal('123');
    expect(result.vcfUrl).to.equal('mocked_vcf_url');
  });
});
