import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import {
  getFormDOM,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { $$ } from '../../../appeals/996/utils/ui';

import formConfig from '../../config/form';

describe('Pre-need preparer info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformation.pages.preparerContactDetails;

  it('should render contact details', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData(
      '#root_application_applicant_view\\:applicantInfo_mailingAddress_country',
      'USA',
    );

    expect($$('input', formDOM).length).to.equal(5);
    // changing from 2 selects to 1 due to hideIf conditional changing state fields appearance
    expect($$('select', formDOM).length).to.equal(2);
  });

  it('should render contact details', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData(
      '#root_application_applicant_view\\:applicantInfo_mailingAddress_country',
      'MEX',
    );

    expect($$('input', formDOM).length).to.equal(5);
    // changing from 2 selects to 1 due to hideIf conditional changing state fields appearance
    expect($$('select', formDOM).length).to.equal(1);
  });
});
