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

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });
});
