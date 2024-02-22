import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import formConfig from '../../../config/form';

describe('Child in household page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.householdInformation.pages.dependentChildInHousehold;

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

  it('should render yes/no field', () => {
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
    expect(formDOM.querySelectorAll('va-radio').length).to.equal(1);
  });
});
