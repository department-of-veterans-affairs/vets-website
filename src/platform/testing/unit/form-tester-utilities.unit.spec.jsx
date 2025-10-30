import { expect } from 'chai';
import sinon from 'sinon';
import { extractBaseNameFromFirstField } from '../e2e/cypress/support/form-tester/patterns';

describe('Form Tester Utilities', () => {
  describe('extractBaseNameFromFirstField', () => {
    let mockFieldGroup;
    let mockPatternField;

    beforeEach(() => {
      mockPatternField = {
        attr: sinon.stub(),
      };

      mockFieldGroup = {
        find: sinon.stub(),
      };
    });

    it('should extract base name from field with suffix', () => {
      const mockPatternFields = {
        length: 1,
        first: () => mockPatternField,
      };

      mockFieldGroup.find
        .withArgs('.vads-web-component-pattern-field')
        .returns(mockPatternFields);
      mockPatternField.attr.withArgs('name').returns('root_address_street');

      const result = extractBaseNameFromFirstField(mockFieldGroup);

      expect(result).to.equal('root_address');
    });

    it('should handle single underscore fields', () => {
      const mockPatternFields = {
        length: 1,
        first: () => mockPatternField,
      };

      mockFieldGroup.find
        .withArgs('.vads-web-component-pattern-field')
        .returns(mockPatternFields);
      mockPatternField.attr.withArgs('name').returns('root_contact');

      const result = extractBaseNameFromFirstField(mockFieldGroup);

      expect(result).to.equal('root');
    });

    it('should use id attribute if name is not available', () => {
      const mockPatternFields = {
        length: 1,
        first: () => mockPatternField,
      };

      mockFieldGroup.find
        .withArgs('.vads-web-component-pattern-field')
        .returns(mockPatternFields);
      mockPatternField.attr.withArgs('name').returns(null);
      mockPatternField.attr.withArgs('id').returns('root_address_city');

      const result = extractBaseNameFromFirstField(mockFieldGroup);

      expect(result).to.equal('root_address');
    });

    it('should return null if no pattern fields found', () => {
      const mockPatternFields = {
        length: 0,
      };

      mockFieldGroup.find
        .withArgs('.vads-web-component-pattern-field')
        .returns(mockPatternFields);

      const result = extractBaseNameFromFirstField(mockFieldGroup);

      expect(result).to.be.null;
    });

    it('should return null if field has no name or id', () => {
      const mockPatternFields = {
        length: 1,
        first: () => mockPatternField,
      };

      mockFieldGroup.find
        .withArgs('.vads-web-component-pattern-field')
        .returns(mockPatternFields);
      mockPatternField.attr.withArgs('name').returns(null);
      mockPatternField.attr.withArgs('id').returns(null);

      const result = extractBaseNameFromFirstField(mockFieldGroup);

      expect(result).to.be.null;
    });
  });
});
