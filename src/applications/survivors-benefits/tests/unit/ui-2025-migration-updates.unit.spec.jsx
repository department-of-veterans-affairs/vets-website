import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  incomeSourceLabels,
  apply2025MonthlyIncomeDetailsRecipient,
  apply2025IncomeSourcesTitle,
  apply2025IncomeAndAssetsTitle,
} from '../../config/ui-2025-migration-updates';
import { incomeRecipientTypeLabels } from '../../utils/labels';

const TOGGLE_KEY = 'survivors_benefits_form_2025_version_enabled';

const createMockStore = (is2025Enabled = false) =>
  createStore(() => ({
    featureToggles: {
      [TOGGLE_KEY]: is2025Enabled,
      loading: false,
    },
    form: { data: {} },
  }));

// Mirrors `incomeRecipientTypeLabels2025` from ui-2025-migration-updates.js
const incomeRecipientTypeLabels2025 = {
  ...incomeRecipientTypeLabels,
  CUSTODIAN: 'Custodian',
  CUSTODIAN_SPOUSE: 'Custodians spouse',
};

describe('UI 2025 Migration Updates', () => {
  describe('apply 2025 version updates to incomeSourceLabels', () => {
    it('has exactly 3 keys in the correct order', () => {
      expect(Object.keys(incomeSourceLabels)).to.deep.equal([
        'NO_INCOME',
        'ONE_TO_FOUR_SOURCES',
        'MORE_THAN_FIVE_SOURCES',
      ]);
    });

    it('has correct label strings', () => {
      expect(incomeSourceLabels.NO_INCOME).to.equal('No income');
      expect(incomeSourceLabels.ONE_TO_FOUR_SOURCES).to.equal(
        '1-4 sources of income',
      );
      expect(incomeSourceLabels.MORE_THAN_FIVE_SOURCES).to.equal(
        '5+ sources of income',
      );
    });
  });

  describe('apply 2025 version updates to monthlyIncomeDetailsRecipient', () => {
    const baseUiSchema = {
      recipient: {
        'ui:title': 'Recipient',
        'ui:widget': 'radio',
      },
    };
    const baseSchema = {
      type: 'object',
      properties: {
        recipient: radioSchema(Object.keys(incomeRecipientTypeLabels)),
      },
    };

    it('returns unchanged uiSchema and schema when recipient is absent', () => {
      const uiSchema = { otherField: {} };
      const schema = { type: 'object', properties: {} };
      const result = apply2025MonthlyIncomeDetailsRecipient(uiSchema, schema);
      expect(result.uiSchema).to.equal(uiSchema);
      expect(result.schema).to.equal(schema);
    });

    it('returns empty defaults when called with no arguments', () => {
      const result = apply2025MonthlyIncomeDetailsRecipient();
      expect(result.uiSchema).to.deep.equal({});
      expect(result.schema).to.deep.equal({});
    });

    it('sets ui:widget to radio when recipient is present', () => {
      const { uiSchema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      expect(uiSchema.recipient['ui:widget']).to.equal('radio');
    });

    it('sets ui:webComponentField to a function when recipient is present', () => {
      const { uiSchema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      expect(uiSchema.recipient['ui:webComponentField']).to.be.a('function');
    });

    it('preserves existing recipient uiSchema properties', () => {
      const { uiSchema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      expect(uiSchema.recipient['ui:title']).to.equal('Recipient');
    });

    it('always sets recipient schema enum to all 4 incomeRecipientTypeLabels2025 keys', () => {
      const { schema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      expect(schema.properties.recipient.enum).to.deep.equal(
        Object.keys(incomeRecipientTypeLabels2025),
      );
    });

    it('renders 2 recipient radio options when is2025Enabled = false', () => {
      const { uiSchema, schema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(false)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      const vaOptions = $$('va-radio-option', formDOM);
      expect(vaOptions.length).to.equal(2);
      expect(vaOptions[0].getAttribute('label')).to.equal(
        incomeRecipientTypeLabels.SURVIVING_SPOUSE,
      );
      expect(vaOptions[1].getAttribute('label')).to.equal(
        incomeRecipientTypeLabels.CHILD,
      );
    });

    it('renders 4 recipient radio options when is2025Enabled = true', () => {
      const { uiSchema, schema } = apply2025MonthlyIncomeDetailsRecipient(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(true)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      const vaOptions = $$('va-radio-option', formDOM);
      expect(vaOptions.length).to.equal(4);
      Object.keys(incomeRecipientTypeLabels2025).forEach((key, index) => {
        expect(vaOptions[index].getAttribute('label')).to.equal(
          incomeRecipientTypeLabels2025[key],
        );
      });
    });
  });

  describe('apply 2025 version updates to incomeSourcesTitle', () => {
    const baseUiSchema = {
      moreThanFourIncomeSources: {
        'ui:title': 'Income sources',
        'ui:widget': 'yesNo',
      },
    };
    const baseSchema = {
      type: 'object',
      properties: {
        moreThanFourIncomeSources: { type: 'string' },
      },
    };

    it('returns unchanged uiSchema and schema when moreThanFourIncomeSources is absent', () => {
      const uiSchema = { otherField: {} };
      const schema = { type: 'object', properties: {} };
      const result = apply2025IncomeSourcesTitle(uiSchema, schema);
      expect(result.uiSchema).to.equal(uiSchema);
      expect(result.schema).to.equal(schema);
    });

    it('returns empty defaults when called with no arguments', () => {
      const result = apply2025IncomeSourcesTitle();
      expect(result.uiSchema).to.deep.equal({});
      expect(result.schema).to.deep.equal({});
    });

    it('sets ui:widget to radio when moreThanFourIncomeSources is present', () => {
      const { uiSchema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      expect(uiSchema.moreThanFourIncomeSources['ui:widget']).to.equal('radio');
    });

    it('sets ui:webComponentField to a function when moreThanFourIncomeSources is present', () => {
      const { uiSchema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      expect(
        uiSchema.moreThanFourIncomeSources['ui:webComponentField'],
      ).to.be.a('function');
    });

    it('preserves existing moreThanFourIncomeSources uiSchema properties', () => {
      const { uiSchema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      expect(uiSchema.moreThanFourIncomeSources['ui:title']).to.equal(
        'Income sources',
      );
    });

    it('sets moreThanFourIncomeSources schema enum to all 3 incomeSourceLabels keys', () => {
      const { schema } = apply2025IncomeSourcesTitle(baseUiSchema, baseSchema);
      expect(schema.properties.moreThanFourIncomeSources.enum).to.deep.equal(
        Object.keys(incomeSourceLabels),
      );
    });

    it('renders Yes/No options when is2025Enabled = false', () => {
      const { uiSchema, schema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(false)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      const vaOptions = $$('va-radio-option', formDOM);
      expect(vaOptions.length).to.equal(2);
      expect(vaOptions[0].getAttribute('label')).to.equal('Yes');
      expect(vaOptions[1].getAttribute('label')).to.equal('No');
    });

    it('renders the default income sources question label when is2025Enabled = false', () => {
      const { uiSchema, schema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(false)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      expect(
        $(
          'va-radio[label*="Do you or your dependents have more than 4 sources of income?"]',
          formDOM,
        ),
      ).to.exist;
    });

    it('renders 3 radio options with incomeSourceLabels when is2025Enabled = true', () => {
      const { uiSchema, schema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(true)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      const vaOptions = $$('va-radio-option', formDOM);
      expect(vaOptions.length).to.equal(3);
      Object.keys(incomeSourceLabels).forEach((key, index) => {
        expect(vaOptions[index].getAttribute('label')).to.equal(
          incomeSourceLabels[key],
        );
      });
    });

    it('renders the 2025 income sources question label when is2025Enabled = true', () => {
      const { uiSchema, schema } = apply2025IncomeSourcesTitle(
        baseUiSchema,
        baseSchema,
      );
      const form = render(
        <Provider store={createMockStore(true)}>
          <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
        </Provider>,
      );
      const formDOM = getFormDOM(form.container);
      expect(
        $(
          'va-radio[label*="How many income sources does your family have?"]',
          formDOM,
        ),
      ).to.exist;
    });
  });

  describe('apply 2025 version updates to incomeAndAssetsTitle', () => {
    const baseTotalNetWorthUiSchema = {
      totalNetWorth: yesNoUI({
        title: 'Do you and your dependents have over $25,000 in assets?',
        required: () => true,
      }),
    };
    const baseSchema = {
      type: 'object',
      properties: { totalNetWorth: yesNoSchema },
      required: ['totalNetWorth'],
    };

    it('returns unchanged uiSchema when totalNetWorth is absent', () => {
      const uiSchema = { otherField: {} };
      const result = apply2025IncomeAndAssetsTitle(uiSchema);
      expect(result).to.equal(uiSchema);
    });

    it('returns empty object when called with no arguments', () => {
      const result = apply2025IncomeAndAssetsTitle();
      expect(result).to.deep.equal({});
    });

    it('sets ui:webComponentField on totalNetWorth when present', () => {
      const result = apply2025IncomeAndAssetsTitle(baseTotalNetWorthUiSchema);
      expect(result.totalNetWorth['ui:webComponentField']).to.be.a('function');
    });

    it('preserves existing totalNetWorth uiSchema properties', () => {
      const result = apply2025IncomeAndAssetsTitle(baseTotalNetWorthUiSchema);
      expect(result.totalNetWorth['ui:title']).to.exist;
    });

    it('adds a ui:title to the returned uiSchema', () => {
      const result = apply2025IncomeAndAssetsTitle(baseTotalNetWorthUiSchema);
      expect(result['ui:title']).to.exist;
    });

    describe('TotalNetWorthYesNoField', () => {
      it('renders va-radio with $25,000 label when is2025Enabled = false', () => {
        const uiSchema = apply2025IncomeAndAssetsTitle(
          baseTotalNetWorthUiSchema,
        );
        const form = render(
          <Provider store={createMockStore(false)}>
            <DefinitionTester
              schema={baseSchema}
              uiSchema={uiSchema}
              data={{}}
            />
          </Provider>,
        );
        const formDOM = getFormDOM(form.container);
        expect($('va-radio[label*="$25,000"]', formDOM)).to.exist;
        expect($('va-radio[label*="$75,000"]', formDOM)).to.be.null;
      });

      it('renders va-radio with $75,000 label when is2025Enabled = true', () => {
        const uiSchema = apply2025IncomeAndAssetsTitle(
          baseTotalNetWorthUiSchema,
        );
        const form = render(
          <Provider store={createMockStore(true)}>
            <DefinitionTester
              schema={baseSchema}
              uiSchema={uiSchema}
              data={{}}
            />
          </Provider>,
        );
        const formDOM = getFormDOM(form.container);
        expect($('va-radio[label*="$75,000"]', formDOM)).to.exist;
        expect($('va-radio[label*="$25,000"]', formDOM)).to.be.null;
      });

      it('renders Yes/No options regardless of toggle', () => {
        [false, true].forEach(is2025Enabled => {
          const uiSchema = apply2025IncomeAndAssetsTitle(
            baseTotalNetWorthUiSchema,
          );
          const form = render(
            <Provider store={createMockStore(is2025Enabled)}>
              <DefinitionTester
                schema={baseSchema}
                uiSchema={uiSchema}
                data={{}}
              />
            </Provider>,
          );
          const formDOM = getFormDOM(form.container);
          const vaOptions = $$('va-radio-option', formDOM);
          expect(vaOptions.length).to.equal(2);
          expect(vaOptions[0].getAttribute('label')).to.equal('Yes');
          expect(vaOptions[1].getAttribute('label')).to.equal('No');
        });
      });
    });

    describe('TotalNetWorthDescription', () => {
      it('renders $25,000 description text when is2025Enabled = false', () => {
        const uiSchema = apply2025IncomeAndAssetsTitle(
          baseTotalNetWorthUiSchema,
        );
        const { container } = render(
          <Provider store={createMockStore(false)}>
            <DefinitionTester
              schema={baseSchema}
              uiSchema={uiSchema}
              data={{}}
            />
          </Provider>,
        );
        expect(container.textContent).to.include(
          'We need to know if you and your dependents have over $25,000 in assets.',
        );
      });

      it('renders $75,000 description text when is2025Enabled = true', () => {
        const uiSchema = apply2025IncomeAndAssetsTitle(
          baseTotalNetWorthUiSchema,
        );
        const { container } = render(
          <Provider store={createMockStore(true)}>
            <DefinitionTester
              schema={baseSchema}
              uiSchema={uiSchema}
              data={{}}
            />
          </Provider>,
        );
        expect(container.textContent).to.include(
          'We need to know if you and your dependents have over $75,000 in assets.',
        );
      });
    });
  });
});
