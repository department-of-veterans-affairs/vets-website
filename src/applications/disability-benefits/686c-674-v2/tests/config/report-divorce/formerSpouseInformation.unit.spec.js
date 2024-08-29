import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';

const defaultStore = createCommonStore();

const formData = (outsideUsa = false, reasonMarriageEnded = 'Divorce') => {
  return {
    'view:selectable686Options': {
      addSpouse: true,
    },
    reportDivorce: {
      divorceLocation: {
        outsideUsa,
      },
      reasonMarriageEnded,
    },
  };
};

describe('686 report divorce: Former spouse full name', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportDivorce.pages.formerSpouseInformation;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
  });
});

describe('686 report divorce: Former spouse information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportDivorce.pages.formerSpouseInformationPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render or remove conditional fields', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData(true, 'Other')}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(2);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});
