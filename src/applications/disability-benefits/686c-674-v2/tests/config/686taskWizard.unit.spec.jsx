import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

const defaultStore = createCommonStore();

describe('686c-674 Task Wizard: Add and Remove dependents page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.optionSelection.pages.addOrRemoveDependents;

  it('should render Add and remove dependents selection', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('va-checkbox', formDOM).length).to.equal(2);
  });
});

describe('686c-674 Task Wizard: Add dependents page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.optionSelection.pages.addDependentOptions;

  it('should render Add dependents selection', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('va-checkbox', formDOM).length).to.equal(4);
  });
});

describe('686c-674 Task Wizard: Remove dependents page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.optionSelection.pages.removeDependentOptions;

  it('should render Remove dependents selection', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('va-checkbox', formDOM).length).to.equal(5);
  });
});
