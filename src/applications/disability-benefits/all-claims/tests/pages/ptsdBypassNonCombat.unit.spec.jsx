import React from 'react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { expect } from 'chai';
import formConfig from '../../config/form';

describe('PTSD bypass non-combat reasons', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.ptsdBypassNonCombat;

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
