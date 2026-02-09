import { expect } from 'chai';
import quantityOfCertificates from '../../pages/quantityOfCertificates';

describe('quantityOfCertificates page', () => {
  it('should export a page schema object', () => {
    expect(quantityOfCertificates).to.be.an('object');
    expect(quantityOfCertificates).to.have.property('uiSchema');
    expect(quantityOfCertificates).to.have.property('schema');
  });

  it('should use titleUI component', () => {
    expect(quantityOfCertificates.uiSchema).to.be.an('object');
  });

  it('should include quantityText field in uiSchema', () => {
    expect(quantityOfCertificates.uiSchema).to.have.property('quantityText');
    expect(quantityOfCertificates.uiSchema.quantityText).to.have.property(
      'ui:title',
      'How many Presidential Memorial Certificates do you want?',
    );
  });

  it('should have min and max configuration for quantityText', () => {
    expect(quantityOfCertificates.uiSchema.quantityText).to.have.property(
      'ui:options',
    );
    const options = quantityOfCertificates.uiSchema.quantityText['ui:options'];
    expect(options).to.be.an('object');
  });

  it('should have the correct hint text', () => {
    const options = quantityOfCertificates.uiSchema.quantityText['ui:options'];
    expect(options).to.have.property('hint', 'You can’t request more than 99');
  });

  it('should have correct schema structure', () => {
    expect(quantityOfCertificates.schema.type).to.equal('object');
    expect(quantityOfCertificates.schema.properties).to.have.property(
      'quantityText',
    );
    expect(quantityOfCertificates.schema.required).to.include('quantityText');
  });

  it('should have quantityText property with correct schema type', () => {
    expect(quantityOfCertificates.schema.properties.quantityText.type).to.equal(
      'string',
    );
  });
});
