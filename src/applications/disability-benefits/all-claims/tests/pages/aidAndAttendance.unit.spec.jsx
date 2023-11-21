import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import { formConfigBase } from '../../config/form';

describe('526 aid and attendance page', () => {
  const {
    schema,
    uiSchema,
  } = formConfigBase.chapters.disabilities.pages.aidAndAttendance;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfigBase.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });
});
