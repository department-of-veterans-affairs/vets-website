import { expect } from 'chai';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import disputeReason from '../../pages/disputeReason';
import DebtTitle from '../../components/DebtTitle';
import { DISPUTE_REASONS } from '../../constants';

describe('disputeReason page', () => {
  it('exports a valid page configuration', () => {
    expect(disputeReason).to.be.an('object');
    expect(disputeReason.uiSchema).to.exist;
    expect(disputeReason.schema).to.exist;
  });

  describe('uiSchema', () => {
    it('has selectedDebts items configuration', () => {
      const itemsConfig = disputeReason.uiSchema.selectedDebts.items;
      expect(itemsConfig).to.exist;
      expect(itemsConfig['ui:title']).to.equal(DebtTitle);
    });

    it('has disputeReason field configuration', () => {
      const disputeReasonConfig =
        disputeReason.uiSchema.selectedDebts.items.disputeReason;
      expect(disputeReasonConfig).to.exist;
      expect(disputeReasonConfig['ui:title']).to.equal(
        "Select the reason you're disputing this debt.",
      );
      expect(disputeReasonConfig['ui:webComponentField']).to.equal(
        VaRadioField,
      );
    });

    it('has required function that returns true', () => {
      const requiredFn =
        disputeReason.uiSchema.selectedDebts.items.disputeReason['ui:required'];
      expect(requiredFn).to.be.a('function');
      expect(requiredFn()).to.be.true;
    });

    it('has correct option labels', () => {
      const {
        labels,
      } = disputeReason.uiSchema.selectedDebts.items.disputeReason[
        'ui:options'
      ];
      expect(labels).to.exist;
      expect(labels.EXISTENCE).to.equal(DISPUTE_REASONS.EXISTENCE);
      expect(labels.AMOUNT).to.equal(DISPUTE_REASONS.AMOUNT);
    });

    it('has error messages configured', () => {
      const errorMessages =
        disputeReason.uiSchema.selectedDebts.items.disputeReason[
          'ui:errorMessages'
        ];
      expect(errorMessages).to.exist;
      expect(errorMessages.required).to.equal(
        'Please select a reason for disputing this debt',
      );
    });
  });

  describe('schema', () => {
    it('has correct structure', () => {
      expect(disputeReason.schema.type).to.equal('object');
      expect(disputeReason.schema.properties).to.exist;
      expect(disputeReason.schema.properties.selectedDebts).to.exist;
    });

    it('has selectedDebts array configuration', () => {
      const selectedDebtsSchema = disputeReason.schema.properties.selectedDebts;
      expect(selectedDebtsSchema.type).to.equal('array');
      expect(selectedDebtsSchema.items).to.exist;
      expect(selectedDebtsSchema.items.type).to.equal('object');
    });

    it('has disputeReason field in items', () => {
      const itemProperties =
        disputeReason.schema.properties.selectedDebts.items.properties;
      expect(itemProperties.disputeReason).to.exist;
      expect(itemProperties.disputeReason.type).to.equal('string');
    });

    it('has correct enum values', () => {
      const disputeReasonField =
        disputeReason.schema.properties.selectedDebts.items.properties
          .disputeReason;
      expect(disputeReasonField.enum).to.be.an('array');
      expect(disputeReasonField.enum).to.include(DISPUTE_REASONS.EXISTENCE);
      expect(disputeReasonField.enum).to.include(DISPUTE_REASONS.AMOUNT);
      expect(disputeReasonField.enum).to.have.length(2);
    });

    it('has required fields specified', () => {
      const { required } = disputeReason.schema.properties.selectedDebts.items;
      expect(required).to.be.an('array');
      expect(required).to.include('disputeReason');
    });
  });

  describe('constants', () => {
    it('defines correct dispute reason options', () => {
      const enumValues =
        disputeReason.schema.properties.selectedDebts.items.properties
          .disputeReason.enum;
      expect(enumValues[0]).to.equal(DISPUTE_REASONS.EXISTENCE);
      expect(enumValues[1]).to.equal(DISPUTE_REASONS.AMOUNT);
    });
  });
});
