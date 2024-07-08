import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Edu 1990 contributions', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.contributions;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(4);
  });
  it('should reveal date fields', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = getFormDOM(form);
    formDOM.setCheckbox('#root_view\\:activeDutyRepayingPeriod', true);

    expect(formDOM.querySelectorAll('input').length).to.equal(6);
  });
});
