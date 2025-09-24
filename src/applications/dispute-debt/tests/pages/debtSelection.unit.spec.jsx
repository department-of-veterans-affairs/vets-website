import { expect } from 'chai';
import sinon from 'sinon';
import debtSelection from '../../pages/debtSelection';
import DebtSelection from '../../components/DebtSelection';

describe('debtSelection page', () => {
  it('exports a valid page configuration', () => {
    expect(debtSelection).to.be.an('object');
    expect(debtSelection.uiSchema).to.exist;
    expect(debtSelection.schema).to.exist;
  });

  describe('uiSchema', () => {
    it('has correct title function', () => {
      const titleFunction = debtSelection.uiSchema['ui:title'];
      expect(titleFunction).to.be.a('function');

      const titleElement = titleFunction();
      expect(titleElement).to.exist;
      expect(titleElement.type).to.exist;
    });

    it('has selectedDebts field configuration', () => {
      const selectedDebtsConfig = debtSelection.uiSchema.selectedDebts;
      expect(selectedDebtsConfig).to.exist;
      expect(selectedDebtsConfig['ui:field']).to.equal(DebtSelection);
      expect(selectedDebtsConfig['ui:options']).to.exist;
      expect(selectedDebtsConfig['ui:options'].hideOnReview).to.be.true;
    });

    it('has validation function', () => {
      const validations =
        debtSelection.uiSchema.selectedDebts['ui:validations'];
      expect(validations).to.be.an('array');
      expect(validations).to.have.length(1);
      expect(validations[0]).to.be.a('function');
    });

    it('validation function adds error for empty debts', () => {
      const validation =
        debtSelection.uiSchema.selectedDebts['ui:validations'][0];
      const mockErrors = {
        addError: sinon.stub(),
      };

      validation(mockErrors, []);

      expect(mockErrors.addError.calledOnce).to.be.true;
      expect(mockErrors.addError.calledWith('Please select at least one debt.'))
        .to.be.true;
    });

    it('validation function does not add error for non-empty debts', () => {
      const validation =
        debtSelection.uiSchema.selectedDebts['ui:validations'][0];
      const mockErrors = {
        addError: sinon.stub(),
      };

      validation(mockErrors, [{ id: '1' }]);

      expect(mockErrors.addError.called).to.be.false;
    });
  });

  describe('schema', () => {
    it('has correct structure', () => {
      expect(debtSelection.schema.type).to.equal('object');
      expect(debtSelection.schema.properties).to.exist;
      expect(debtSelection.schema.properties.selectedDebts).to.exist;
    });

    it('has selectedDebts array configuration', () => {
      const selectedDebtsSchema = debtSelection.schema.properties.selectedDebts;
      expect(selectedDebtsSchema.type).to.equal('array');
      expect(selectedDebtsSchema.items).to.exist;
      expect(selectedDebtsSchema.items.type).to.equal('object');
      expect(selectedDebtsSchema.items.properties).to.exist;
    });
  });

  describe('title rendering', () => {
    it('renders correct title text', () => {
      const titleFunction = debtSelection.uiSchema['ui:title'];
      const titleElement = titleFunction();

      // Check that it's a React fragment with h3
      expect(titleElement.props.children.type).to.equal('h3');
      expect(titleElement.props.children.props.children).to.equal(
        'Which debt are you disputing?',
      );
      expect(titleElement.props.children.props.className).to.include(
        'vads-u-margin--0',
      );
      expect(titleElement.props.children.props.className).to.include(
        'vads-u-font-size--h2',
      );
    });
  });
});
