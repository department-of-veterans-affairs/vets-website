import { expect } from 'chai';
import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import supportStatement from '../../pages/supportStatement';
import DebtTitle from '../../components/DebtTitle';

describe('supportStatement page', () => {
  it('exports a valid page configuration', () => {
    expect(supportStatement).to.be.an('object');
    expect(supportStatement.uiSchema).to.exist;
    expect(supportStatement.schema).to.exist;
  });

  describe('uiSchema', () => {
    it('has selectedDebts items configuration', () => {
      const itemsConfig = supportStatement.uiSchema.selectedDebts.items;
      expect(itemsConfig).to.exist;
      expect(itemsConfig['ui:title']).to.equal(DebtTitle);
    });

    it('has supportStatement field configuration', () => {
      const supportStatementConfig =
        supportStatement.uiSchema.selectedDebts.items.supportStatement;
      expect(supportStatementConfig).to.exist;
      expect(supportStatementConfig['ui:title']).to.include('Tell us why');
      expect(supportStatementConfig['ui:title']).to.include(
        'disputing this debt',
      );
      expect(supportStatementConfig['ui:webComponentField']).to.equal(
        VaTextareaField,
      );
    });

    it('has required function that returns true', () => {
      const requiredFn =
        supportStatement.uiSchema.selectedDebts.items.supportStatement[
          'ui:required'
        ];
      expect(requiredFn).to.be.a('function');
      expect(requiredFn()).to.be.true;
    });

    it('has error messages configured', () => {
      const errorMessages =
        supportStatement.uiSchema.selectedDebts.items.supportStatement[
          'ui:errorMessages'
        ];
      expect(errorMessages).to.exist;
      expect(errorMessages.required).to.equal('Please provide a response');
    });
  });

  describe('schema', () => {
    it('has correct structure', () => {
      expect(supportStatement.schema.type).to.equal('object');
      expect(supportStatement.schema.properties).to.exist;
      expect(supportStatement.schema.properties.selectedDebts).to.exist;
    });

    it('has selectedDebts array configuration', () => {
      const selectedDebtsSchema =
        supportStatement.schema.properties.selectedDebts;
      expect(selectedDebtsSchema.type).to.equal('array');
      expect(selectedDebtsSchema.items).to.exist;
      expect(selectedDebtsSchema.items.type).to.equal('object');
    });

    it('has supportStatement field in items', () => {
      const itemProperties =
        supportStatement.schema.properties.selectedDebts.items.properties;
      expect(itemProperties.supportStatement).to.exist;
      expect(itemProperties.supportStatement.type).to.equal('string');
    });

    it('has required fields specified', () => {
      const {
        required,
      } = supportStatement.schema.properties.selectedDebts.items;
      expect(required).to.be.an('array');
      expect(required).to.include('supportStatement');
    });
  });

  describe('field validation', () => {
    it('requires supportStatement field', () => {
      const {
        required,
      } = supportStatement.schema.properties.selectedDebts.items;
      expect(required).to.include('supportStatement');
    });

    it('has string type for supportStatement', () => {
      const supportStatementField =
        supportStatement.schema.properties.selectedDebts.items.properties
          .supportStatement;
      expect(supportStatementField.type).to.equal('string');
    });
  });
});
