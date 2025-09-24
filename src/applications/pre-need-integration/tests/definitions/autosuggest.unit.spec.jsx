import { expect } from 'chai';
import sinon from 'sinon';
import { validateAutosuggestOption } from 'platform/forms-system/src/js/validation';
import { schema, uiSchema } from '../../definitions/autosuggest';
import AutosuggestField from '../../components/AutosugggestField';

describe('Autosuggest Schema and UI Schema', () => {
  describe('schema', () => {
    it('should have the correct type', () => {
      expect(schema.type).to.equal('object');
    });

    it('should define id and label properties', () => {
      expect(schema.properties).to.have.keys(['id', 'label']);
      expect(schema.properties.id.type).to.equal('any');
      expect(schema.properties.label.type).to.equal('string');
    });
  });

  describe('uiSchema', () => {
    const mockGetOptions = sinon.stub().resolves([]);
    const testLabel = 'Test Field';

    it('should return a properly structured UI schema', () => {
      const result = uiSchema(testLabel, mockGetOptions);

      expect(result['ui:title']).to.equal(testLabel);
      expect(result['ui:field']).to.equal(AutosuggestField);
      expect(result['ui:validations']).to.deep.include(
        validateAutosuggestOption,
      );
      expect(result['ui:errorMessages'].required).to.be.a('string');
    });

    it('should include getOptions in ui:options', () => {
      const result = uiSchema(testLabel, mockGetOptions);

      expect(result['ui:options'].getOptions).to.equal(mockGetOptions);
      expect(result['ui:options'].showFieldLabel).to.equal('label');
      expect(result['ui:options'].maxOptions).to.equal(20);
    });

    it('should not include validateAutosuggestOption when freeInput is true', () => {
      const result = uiSchema(testLabel, mockGetOptions, {
        'ui:options': { freeInput: true },
      });

      expect(result['ui:validations']).to.not.include(
        validateAutosuggestOption,
      );
    });

    it('should merge custom options properly', () => {
      const customOptions = {
        'ui:title': 'Custom Title',
        'ui:options': {
          maxOptions: 10,
          customProp: 'value',
        },
      };

      const result = uiSchema(testLabel, mockGetOptions, customOptions);

      expect(result['ui:title']).to.equal('Custom Title');
      expect(result['ui:options'].maxOptions).to.equal(10);
      expect(result['ui:options'].customProp).to.equal('value');
      // Original properties should still be there
      expect(result['ui:options'].getOptions).to.equal(mockGetOptions);
      expect(result['ui:options'].showFieldLabel).to.equal('label');
    });

    it('should keep getOptions when merging custom options', () => {
      const customGetOptions = sinon.stub().resolves(['option1', 'option2']);
      const result = uiSchema(testLabel, customGetOptions, {
        'ui:options': {
          someOtherProp: true,
        },
      });

      expect(result['ui:options'].getOptions).to.equal(customGetOptions);
      expect(result['ui:options'].someOtherProp).to.equal(true);
    });

    it('should correctly handle empty options parameter', () => {
      const result = uiSchema(testLabel, mockGetOptions);

      expect(result['ui:title']).to.equal(testLabel);
      expect(result['ui:options'].getOptions).to.equal(mockGetOptions);
    });
  });
});
