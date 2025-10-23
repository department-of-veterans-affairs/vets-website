import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Edu 10203 directDeposit', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.directDeposit;
  it('renders the correct amount of options', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });
});
