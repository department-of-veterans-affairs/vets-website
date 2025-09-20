import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('686 household income', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdIncome.pages.householdIncome;

  it('should render the accordion with net worth details', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const netWorthAccordion = container.querySelector(
      '#what-we-count-as-assets',
    );
    expect(netWorthAccordion).to.not.be.null;
    expect(netWorthAccordion.getAttribute('header')).to.equal(
      'What we count as assets',
    );
    expect(netWorthAccordion.getAttribute('level')).to.equal('4');
    expect(netWorthAccordion.parentElement.getAttribute('open-single')).to.eq(
      'true',
    );
  });
});
