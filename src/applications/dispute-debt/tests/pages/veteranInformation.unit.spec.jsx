import { expect } from 'chai';
import veteranInformation from '../../pages/veteranInformation';
import VeteranInformation from '../../components/VeteranInformation';

describe('veteranInformation page', () => {
  it('exports a valid page configuration', () => {
    expect(veteranInformation).to.be.an('object');
    expect(veteranInformation.uiSchema).to.exist;
    expect(veteranInformation.schema).to.exist;
  });

  describe('uiSchema', () => {
    it('has VeteranInformation component as description', () => {
      expect(veteranInformation.uiSchema['ui:description']).to.equal(
        VeteranInformation,
      );
    });

    it('has ui:options configured', () => {
      const options = veteranInformation.uiSchema['ui:options'];
      expect(options).to.exist;
      expect(options.hideOnReview).to.be.true;
    });

    it('hides on review', () => {
      expect(veteranInformation.uiSchema['ui:options'].hideOnReview).to.be.true;
    });
  });

  describe('schema', () => {
    it('has correct structure', () => {
      expect(veteranInformation.schema.type).to.equal('object');
      expect(veteranInformation.schema.properties).to.exist;
    });

    it('has empty properties object', () => {
      expect(veteranInformation.schema.properties).to.be.an('object');
      expect(Object.keys(veteranInformation.schema.properties)).to.have.length(
        0,
      );
    });
  });

  describe('configuration', () => {
    it('is a display-only page with no form fields', () => {
      // This page only shows veteran information, no form inputs
      expect(Object.keys(veteranInformation.schema.properties)).to.have.length(
        0,
      );
      expect(veteranInformation.uiSchema['ui:description']).to.equal(
        VeteranInformation,
      );
    });

    it('uses VeteranInformation component for display', () => {
      expect(veteranInformation.uiSchema['ui:description']).to.be.a('function');
    });
  });
});
