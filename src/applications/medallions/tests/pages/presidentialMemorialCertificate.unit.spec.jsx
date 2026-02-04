import { expect } from 'chai';
import presidentialMemorialCertificate from '../../pages/presidentialMemorialCertificate';

describe('presidentialMemorialCertificate page', () => {
  it('should export a page schema object', () => {
    expect(presidentialMemorialCertificate).to.be.an('object');
    expect(presidentialMemorialCertificate).to.have.property('uiSchema');
    expect(presidentialMemorialCertificate).to.have.property('schema');
  });

  it('should use titleUI component', () => {
    expect(presidentialMemorialCertificate.uiSchema).to.be.an('object');
  });

  it('should have the correct page description', () => {
    expect(presidentialMemorialCertificate.uiSchema['ui:description']).to.exist;
  });

  it('should include pmcYesNo field in uiSchema', () => {
    expect(presidentialMemorialCertificate.uiSchema).to.have.property(
      'pmcYesNo',
    );
    expect(presidentialMemorialCertificate.uiSchema.pmcYesNo).to.have.property(
      'ui:title',
      'Do you want a Presidential Memorial Certificate?',
    );
  });

  it('should use yes/no widget for pmcYesNo field', () => {
    expect(presidentialMemorialCertificate.uiSchema.pmcYesNo).to.have.property(
      'ui:widget',
      'yesNo',
    );
  });

  it('should have correct schema structure', () => {
    expect(presidentialMemorialCertificate.schema.type).to.equal('object');
    expect(presidentialMemorialCertificate.schema.properties).to.have.property(
      'pmcYesNo',
    );
    expect(presidentialMemorialCertificate.schema.required).to.include(
      'pmcYesNo',
    );
  });

  it('should have pmcYesNo property with correct schema type', () => {
    expect(
      presidentialMemorialCertificate.schema.properties.pmcYesNo.type,
    ).to.equal('boolean');
  });

  it('should have Learn More description section', () => {
    expect(presidentialMemorialCertificate.uiSchema['ui:description']).to.exist;
  });
});
