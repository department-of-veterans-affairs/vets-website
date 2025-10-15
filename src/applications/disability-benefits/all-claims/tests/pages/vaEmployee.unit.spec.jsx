import React from 'react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { expect } from 'chai';
import formConfig from '../../config/form';

describe('526 vaEmployee', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.vaEmployee;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    expect(form.find('VaRadio').length).to.equal(1);
    expect(form.find('va-radio-option').length).to.equal(2);
    form.unmount();
  });
});
