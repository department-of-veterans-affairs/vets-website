import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import formConfig from '../../../config/form';

describe('Child address page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.householdInformation.pages.dependentChildAddress;
  const nameData = {
    'view:hasDependents': true,
    dependents: [
      {
        fullName: {
          first: 'Jane',
          last: 'Doe',
        },
        dependentRelationship: 'child',
      },
    ],
  };
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={nameData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(
      2,
    );
  });

  it('should render address fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={nameData}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    formDOM.setYesNo('input#root_childInHouseholdNo', 'N');

    expect(formDOM.querySelectorAll('va-select').length).to.equal(1);
    expect(formDOM.querySelectorAll('va-text-input').length).to.equal(5);
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        onSubmit={onSubmit}
        data={nameData}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={nameData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_childInHouseholdYes', 'Y');

    formDOM.submitForm(form);
    expect(onSubmit.called).to.be.true;
  });

  it('should set the title to the dependents name if available', () => {
    const pageTitle = title;
    expect(
      pageTitle({
        fullName: { first: 'Jane', last: 'Doe' },
      }),
    ).to.eql('Jane Doe address');
    expect(pageTitle({ fullName: {} })).to.eql('  address');
  });
});
