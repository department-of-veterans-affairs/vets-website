import { expect } from 'chai';

import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from '../../../src/js/web-component-patterns/arrayBuilderPatterns';

describe('arrayBuilderYesNoUI', () => {
  describe('hint text based on required option', () => {
    it('should show "You\'ll need to add" hint when required is true and no items exist', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: true,
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with empty array
      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain("You'll need to add at least one employer.");
      expect(hint).to.not.contain('If you answer yes');
    });

    it('should show "If you answer yes" hint when required is false and no items exist', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: false,
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with empty array
      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain(
        "If you answer yes, you'll need to add at least one employer.",
      );
    });

    it('should show "If you answer yes" hint when required is not specified (defaults to falsy)', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with empty array
      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain(
        "If you answer yes, you'll need to add at least one employer.",
      );
    });

    it('should support required as a function that returns true', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: () => true,
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with empty array
      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain("You'll need to add at least one employer.");
      expect(hint).to.not.contain('If you answer yes');
    });

    it('should support required as a function that returns false', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: () => false,
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with empty array
      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain(
        "If you answer yes, you'll need to add at least one employer.",
      );
    });

    it('should include maxItems hint when specified and no items exist (required)', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: true,
        maxItems: 5,
      });

      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain('You can add up to 5.');
    });

    it('should include maxItems hint when specified and no items exist (optional)', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: false,
        maxItems: 5,
      });

      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.contain('You can add up to 5.');
    });

    it('should use custom hint when provided via yesNoOptionsInitial', () => {
      const uiSchema = arrayBuilderYesNoUI(
        {
          arrayPath: 'employers',
          nounSingular: 'employer',
          nounPlural: 'employers',
          required: true,
          maxItems: 5,
        },
        {
          hint: 'Custom initial hint text',
        },
      );

      const formData = { employers: [] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      expect(hint).to.equal('Custom initial hint text');
    });

    it('should not apply initial hint changes when items exist (uses additional item hint)', () => {
      const uiSchema = arrayBuilderYesNoUI({
        arrayPath: 'employers',
        nounSingular: 'employer',
        nounPlural: 'employers',
        required: true,
        maxItems: 5,
      });

      // Simulate the updateUiSchema call with existing items
      const formData = { employers: [{ name: 'Test' }] };
      const updatedSchema = uiSchema['ui:options'].updateUiSchema(formData);
      const { hint } = updatedSchema['ui:options'];

      // When items exist, different hint is used (maxItemsHint)
      expect(hint).to.not.contain("You'll need to add");
      expect(hint).to.not.contain('If you answer yes');
      // Instead it shows remaining capacity hint
      expect(hint).to.contain('You can add 4 more employers.');
    });
  });

  it('should export arrayBuilderYesNoSchema', () => {
    expect(arrayBuilderYesNoSchema).to.exist;
    expect(arrayBuilderYesNoSchema.type).to.equal('boolean');
  });
});
