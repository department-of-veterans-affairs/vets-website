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

  it('should render all fields', () => {
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
      11,
    );
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
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).not.to.be.true;
  });

  // This is where we would test that it submits with valid data if RTL worked
  // with web components

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
