import { expect } from 'chai';

import { nursingCareInformation } from '@bio-aquia/21-0779-nursing-home-information/pages/nursing-care-information/nursing-care-information';

describe('Nursing Care Information Page Schema', () => {
  describe('Schema Structure', () => {
    it('should export a page schema object', () => {
      expect(nursingCareInformation).to.exist;
      expect(nursingCareInformation).to.be.an('object');
    });

    it('should have uiSchema property', () => {
      expect(nursingCareInformation.uiSchema).to.exist;
      expect(nursingCareInformation.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(nursingCareInformation.schema).to.exist;
      expect(nursingCareInformation.schema).to.be.an('object');
    });
  });

  describe('Data Schema Configuration', () => {
    it('should be an object type', () => {
      expect(nursingCareInformation.schema.type).to.equal('object');
    });

    it('should have properties defined', () => {
      expect(nursingCareInformation.schema.properties).to.exist;
      expect(nursingCareInformation.schema.properties).to.be.an('object');
    });

    it('should have nursingOrCustodialCare property', () => {
      expect(nursingCareInformation.schema.properties.nursingOrCustodialCare).to
        .exist;
      expect(
        nursingCareInformation.schema.properties.nursingOrCustodialCare.type,
      ).to.equal('boolean');
    });

    it('should have medicaidCoverNursingHome property', () => {
      expect(nursingCareInformation.schema.properties.medicaidCoverNursingHome)
        .to.exist;
      expect(
        nursingCareInformation.schema.properties.medicaidCoverNursingHome.type,
      ).to.equal('boolean');
    });

    it('should have medicaidPerDiem property', () => {
      expect(nursingCareInformation.schema.properties.medicaidPerDiem).to.exist;
      expect(
        nursingCareInformation.schema.properties.medicaidPerDiem.type,
      ).to.equal('number');
    });

    it('should have amountPaidToNursingHome property', () => {
      expect(nursingCareInformation.schema.properties.amountPaidToNursingHome)
        .to.exist;
      expect(
        nursingCareInformation.schema.properties.amountPaidToNursingHome.type,
      ).to.equal('number');
    });

    it('should have amountPaidByOthers property', () => {
      expect(nursingCareInformation.schema.properties.amountPaidByOthers).to
        .exist;
      expect(
        nursingCareInformation.schema.properties.amountPaidByOthers.type,
      ).to.equal('number');
    });

    it('should have otherPaymentSource property', () => {
      expect(nursingCareInformation.schema.properties.otherPaymentSource).to
        .exist;
      expect(
        nursingCareInformation.schema.properties.otherPaymentSource.type,
      ).to.equal('string');
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have title configuration', () => {
      expect(nursingCareInformation.uiSchema['ui:title']).to.exist;
    });

    it('should have nursingOrCustodialCare field configuration', () => {
      expect(nursingCareInformation.uiSchema.nursingOrCustodialCare).to.exist;
      expect(nursingCareInformation.uiSchema.nursingOrCustodialCare['ui:title'])
        .to.exist;
    });

    it('should configure nursingOrCustodialCare as radio button', () => {
      expect(
        nursingCareInformation.uiSchema.nursingOrCustodialCare[
          'ui:webComponentField'
        ],
      ).to.equal('va-radio');
    });

    it('should have medicaidCoverNursingHome field configuration', () => {
      expect(nursingCareInformation.uiSchema.medicaidCoverNursingHome).to.exist;
      expect(
        nursingCareInformation.uiSchema.medicaidCoverNursingHome['ui:title'],
      ).to.exist;
    });

    it('should configure medicaidCoverNursingHome as radio button', () => {
      expect(
        nursingCareInformation.uiSchema.medicaidCoverNursingHome[
          'ui:webComponentField'
        ],
      ).to.equal('va-radio');
    });

    it('should have medicaidPerDiem field configuration', () => {
      expect(nursingCareInformation.uiSchema.medicaidPerDiem).to.exist;
      expect(nursingCareInformation.uiSchema.medicaidPerDiem['ui:title']).to
        .exist;
    });

    it('should configure medicaidPerDiem as number input', () => {
      expect(
        nursingCareInformation.uiSchema.medicaidPerDiem['ui:webComponentField'],
      ).to.equal('va-number-input');
    });

    it('should have amountPaidToNursingHome field configuration', () => {
      expect(nursingCareInformation.uiSchema.amountPaidToNursingHome).to.exist;
      expect(
        nursingCareInformation.uiSchema.amountPaidToNursingHome['ui:title'],
      ).to.exist;
    });

    it('should configure amountPaidToNursingHome as number input', () => {
      expect(
        nursingCareInformation.uiSchema.amountPaidToNursingHome[
          'ui:webComponentField'
        ],
      ).to.equal('va-number-input');
    });

    it('should have amountPaidByOthers field configuration', () => {
      expect(nursingCareInformation.uiSchema.amountPaidByOthers).to.exist;
      expect(nursingCareInformation.uiSchema.amountPaidByOthers['ui:title']).to
        .exist;
    });

    it('should configure amountPaidByOthers as number input', () => {
      expect(
        nursingCareInformation.uiSchema.amountPaidByOthers[
          'ui:webComponentField'
        ],
      ).to.equal('va-number-input');
    });

    it('should have otherPaymentSource field configuration', () => {
      expect(nursingCareInformation.uiSchema.otherPaymentSource).to.exist;
      expect(nursingCareInformation.uiSchema.otherPaymentSource['ui:title']).to
        .exist;
    });

    it('should configure otherPaymentSource as textarea', () => {
      expect(
        nursingCareInformation.uiSchema.otherPaymentSource[
          'ui:webComponentField'
        ],
      ).to.equal('va-textarea');
    });
  });

  describe('Radio Button Labels', () => {
    it('should have Yes/No labels for nursingOrCustodialCare', () => {
      const { labels } = nursingCareInformation.uiSchema.nursingOrCustodialCare[
        'ui:options'
      ];
      expect(labels.true).to.equal('Yes');
      expect(labels.false).to.equal('No');
    });

    it('should have Yes/No labels for medicaidCoverNursingHome', () => {
      const {
        labels,
      } = nursingCareInformation.uiSchema.medicaidCoverNursingHome[
        'ui:options'
      ];
      expect(labels.true).to.equal('Yes');
      expect(labels.false).to.equal('No');
    });
  });

  describe('Field Count', () => {
    it('should have exactly 6 form fields defined', () => {
      const propertyKeys = Object.keys(
        nursingCareInformation.schema.properties,
      );
      expect(propertyKeys.length).to.equal(6);
    });

    it('should have 6 UI field configurations (excluding title)', () => {
      const uiFieldKeys = Object.keys(nursingCareInformation.uiSchema).filter(
        key => !key.startsWith('ui:'),
      );
      expect(uiFieldKeys.length).to.equal(6);
    });
  });

  describe('Field Types', () => {
    it('should have 2 boolean fields', () => {
      const booleanFields = Object.values(
        nursingCareInformation.schema.properties,
      ).filter(prop => prop.type === 'boolean');
      expect(booleanFields.length).to.equal(2);
    });

    it('should have 3 number fields', () => {
      const numberFields = Object.values(
        nursingCareInformation.schema.properties,
      ).filter(prop => prop.type === 'number');
      expect(numberFields.length).to.equal(3);
    });

    it('should have 1 string field', () => {
      const stringFields = Object.values(
        nursingCareInformation.schema.properties,
      ).filter(prop => prop.type === 'string');
      expect(stringFields.length).to.equal(1);
    });
  });

  describe('Widget Class Names', () => {
    it('should have margin class on number inputs', () => {
      expect(
        nursingCareInformation.uiSchema.medicaidPerDiem['ui:options']
          .widgetClassNames,
      ).to.equal('vads-u-margin-bottom--2');
      expect(
        nursingCareInformation.uiSchema.amountPaidToNursingHome['ui:options']
          .widgetClassNames,
      ).to.equal('vads-u-margin-bottom--2');
      expect(
        nursingCareInformation.uiSchema.amountPaidByOthers['ui:options']
          .widgetClassNames,
      ).to.equal('vads-u-margin-bottom--2');
    });

    it('should have margin class on textarea', () => {
      expect(
        nursingCareInformation.uiSchema.otherPaymentSource['ui:options']
          .widgetClassNames,
      ).to.equal('vads-u-margin-bottom--2');
    });
  });
});
