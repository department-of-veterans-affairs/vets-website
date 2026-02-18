import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import {
  schema,
  uiSchema,
} from '../../../../config/chapters/household-income/householdIncome';

const defaultStore = createCommonStore();

describe('686 household income: schema', () => {
  it('should have the correct properties', () => {
    expect(schema.type).to.equal('object');
    expect(schema.properties).to.have.property('view:householdIncome');
    expect(schema.properties).to.have.property('view:householdIncomeFooter');
  });

  it('should have view:householdIncome as a string with enum values', () => {
    const viewHouseholdIncome = schema.properties['view:householdIncome'];
    expect(viewHouseholdIncome.type).to.equal('string');
    expect(viewHouseholdIncome.enum).to.deep.equal(['Y', 'N', '']);
  });
});

describe('686 household income: uiSchema', () => {
  it('should have ui:title defined', () => {
    expect(uiSchema['ui:title']).to.exist;
  });

  it('should have ui:description as a function', () => {
    expect(typeof uiSchema['ui:description']).to.equal('function');
  });

  it('should have updateSchema function in ui:options', () => {
    expect(typeof uiSchema['ui:options'].updateSchema).to.equal('function');
  });

  it('should have view:householdIncome field with updateUiSchema', () => {
    expect(uiSchema['view:householdIncome']).to.exist;
    expect(uiSchema['view:householdIncome']['ui:webComponentField']).to.exist;
  });
});

describe('686 household income: updateSchema logic', () => {
  const { updateSchema } = uiSchema['ui:options'];

  const baseFormSchema = {
    properties: {
      'view:householdIncome': {
        type: 'string',
        enum: ['Y', 'N', ''],
      },
    },
  };

  describe('value transformation', () => {
    it('should set householdIncome to false when view:householdIncome is "Y"', () => {
      const formData = { 'view:householdIncome': 'Y' };
      updateSchema(formData, baseFormSchema);
      expect(formData.householdIncome).to.equal(false);
    });

    it('should set householdIncome to true when view:householdIncome is "N"', () => {
      const formData = { 'view:householdIncome': 'N' };
      updateSchema(formData, baseFormSchema);
      expect(formData.householdIncome).to.equal(true);
    });

    it('should delete householdIncome when view:householdIncome is empty string', () => {
      const formData = { 'view:householdIncome': '', householdIncome: true };
      updateSchema(formData, baseFormSchema);
      expect(formData).to.not.have.property('householdIncome');
    });

    it('should not modify householdIncome when view:householdIncome is undefined', () => {
      const formData = { householdIncome: true };
      updateSchema(formData, baseFormSchema);
      // When view:householdIncome is undefined, prefill logic kicks in
      expect(formData['view:householdIncome']).to.equal('N');
    });
  });

  describe('prefill mapping (in-progress form)', () => {
    it('should set view:householdIncome to "N" when householdIncome is true', () => {
      const formData = { householdIncome: true };
      updateSchema(formData, baseFormSchema);
      expect(formData['view:householdIncome']).to.equal('N');
    });

    it('should set view:householdIncome to "Y" when householdIncome is false', () => {
      const formData = { householdIncome: false };
      updateSchema(formData, baseFormSchema);
      expect(formData['view:householdIncome']).to.equal('Y');
    });

    it('should not set view:householdIncome when householdIncome is undefined', () => {
      const formData = {};
      updateSchema(formData, baseFormSchema);
      expect(formData).to.not.have.property('view:householdIncome');
    });
  });

  describe('feature flag behavior', () => {
    it('should return 3 enum values when feature flag is OFF', () => {
      const formData = { vaDependentsNetWorthAndPension: false };
      const result = updateSchema(formData, baseFormSchema);
      expect(result.properties['view:householdIncome'].enum).to.deep.equal([
        'Y',
        'N',
        '',
      ]);
    });

    it('should return 2 enum values when feature flag is ON', () => {
      const formData = { vaDependentsNetWorthAndPension: true };
      const result = updateSchema(formData, baseFormSchema);
      expect(result.properties['view:householdIncome'].enum).to.deep.equal([
        'Y',
        'N',
      ]);
    });

    it('should return 3 enum values when feature flag is undefined', () => {
      const formData = {};
      const result = updateSchema(formData, baseFormSchema);
      expect(result.properties['view:householdIncome'].enum).to.deep.equal([
        'Y',
        'N',
        '',
      ]);
    });
  });
});

describe('686 household income: rendering', () => {
  const getPage = () =>
    formConfig.chapters.householdIncome.pages.householdIncome;

  it('should render va-radio component', () => {
    const { schema: pageSchema, uiSchema: pageUiSchema } = getPage();

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={pageSchema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={pageUiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
  });

  it('should render 3 radio options when feature flag is OFF', () => {
    const { schema: pageSchema, uiSchema: pageUiSchema } = getPage();

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={pageSchema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={pageUiSchema}
          data={{ vaDependentsNetWorthAndPension: false }}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(3);
  });

  it('should render 2 radio options when feature flag is ON', () => {
    const { schema: pageSchema, uiSchema: pageUiSchema } = getPage();

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={pageSchema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={pageUiSchema}
          data={{ vaDependentsNetWorthAndPension: true }}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should show "This question doesn’t apply to me" option when feature flag is OFF', () => {
    const { schema: pageSchema, uiSchema: pageUiSchema } = getPage();

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={pageSchema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={pageUiSchema}
          data={{ vaDependentsNetWorthAndPension: false }}
        />
      </Provider>,
    );

    const options = $$('va-radio-option', container);
    const labels = options.map(opt => opt.getAttribute('label'));
    expect(labels).to.include('This question doesn’t apply to me');
  });

  it('should NOT show "This question doesn’t apply to me" option when feature flag is ON', () => {
    const { schema: pageSchema, uiSchema: pageUiSchema } = getPage();

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={pageSchema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={pageUiSchema}
          data={{ vaDependentsNetWorthAndPension: true }}
        />
      </Provider>,
    );

    const options = $$('va-radio-option', container);
    const labels = options.map(opt => opt.getAttribute('label'));
    expect(labels).to.not.include('This question doesn’t apply to me');
  });
});
