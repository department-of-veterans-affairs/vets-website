import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need preparer info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformation.pages.preparerContactDetails;

  it('should render contact details', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    // changing from 2 selects to 1 due to hideIf conditional changing state fields appearance
    expect(form.find('select').length).to.equal(1);
    form.unmount();
  });
});
