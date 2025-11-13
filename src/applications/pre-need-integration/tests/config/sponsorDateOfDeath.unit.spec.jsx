import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need sponsor date of death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorDateOfDeath;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('VaMemorableDate').length).to.equal(1);
    form.unmount();
  });
});
