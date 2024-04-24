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
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Benefits Selection', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitsSelection.pages.benefitsSelection;

  it('should render', () => {
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

    expect($$('va-checkbox', formDOM).length).to.equal(3);
  });

  it('should show "not selected" on review page', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ 'view:claimedBenefits': { plotAllowance: true } }}
          reviewMode
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);
    const spanContent = $$('span', formDOM).map(s => s.innerHTML);
    expect(spanContent.filter(s => s === 'Selected').length).to.equal(1);
    expect(spanContent.filter(s => s === 'Not selected').length).to.equal(2);
  });
});
