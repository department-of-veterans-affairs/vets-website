import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};

describe('686 add child additional information part two', () => {
  const { schema, uiSchema } =
    formConfig.chapters.addChild.pages.addChildAdditionalInformationPartTwo;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-radio-option').length).to.eq(3);
  });

  describe('updateSchema functionality', () => {
    const { updateSchema } =
      uiSchema.childrenToAdd.items.incomeInLastYear['ui:options'];
    const baseSchema =
      schema.properties.childrenToAdd.items.properties.incomeInLastYear;

    it('should return original schema when vaDependentsNetWorthAndPension is false', () => {
      const testData = {
        vaDependentsNetWorthAndPension: false,
      };

      const result = updateSchema(testData, baseSchema);
      expect(result).to.equal(baseSchema);
    });

    it('should return original schema when vaDependentsNetWorthAndPension is undefined', () => {
      const testData = {};

      const result = updateSchema(testData, baseSchema);
      expect(result).to.equal(baseSchema);
    });

    it('should return modified schema with only Y/N options when vaDependentsNetWorthAndPension is true', () => {
      const testData = {
        vaDependentsNetWorthAndPension: true,
      };

      const result = updateSchema(testData, baseSchema);
      expect(result.enum).to.deep.equal(['Y', 'N']);
      expect(result.enum).to.not.include('NA');
    });

    it('should handle empty formData', () => {
      const result = updateSchema(undefined, baseSchema);
      expect(result).to.equal(baseSchema);
    });
  });

  describe('updateUiSchema functionality', () => {
    const { updateUiSchema } =
      uiSchema.childrenToAdd.items.incomeInLastYear['ui:options'];

    it('should remove hint when vaDependentsNetWorthAndPension is true', () => {
      const testData = {
        vaDependentsNetWorthAndPension: true,
      };
      const result = updateUiSchema(testData);
      expect(result['ui:options'].hint).to.equal('');
    });

    it('should keep hint when vaDependentsNetWorthAndPension is false', () => {
      const testData = {
        vaDependentsNetWorthAndPension: false,
      };
      const result = updateUiSchema(testData);
      expect(result).to.deep.equal({});
    });

    it('should keep hint when vaDependentsNetWorthAndPension is undefined', () => {
      const testData = {};
      const result = updateUiSchema(testData);
      expect(result).to.deep.equal({});
    });
  });

  describe('required functionality', () => {
    const required =
      uiSchema.childrenToAdd.items.incomeInLastYear['ui:required'];

    it('should be required when vaDependentsNetWorthAndPension is true', () => {
      const testData = {
        vaDependentsNetWorthAndPension: true,
      };

      const result = required({}, 0, testData);
      expect(result).to.be.true;
    });

    it('should not be required when vaDependentsNetWorthAndPension is false', () => {
      const testData = {
        vaDependentsNetWorthAndPension: false,
      };

      const result = required({}, 0, testData);
      expect(result).to.be.false;
    });

    it('should not be required when vaDependentsNetWorthAndPension is undefined', () => {
      const testData = {};

      const result = required({}, 0, testData);
      expect(result).to.be.undefined;
    });
  });
});
