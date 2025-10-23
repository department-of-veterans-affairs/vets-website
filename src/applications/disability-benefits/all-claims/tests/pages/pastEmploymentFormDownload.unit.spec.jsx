import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import { VA_FORM4192_URL } from '../../constants';

describe('Disability benefits 4192 Download', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.pastEmploymentFormDownload;

  it('renders 4192 form download', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    const { href } = form
      .find('a')
      .first()
      .props();
    expect(href).to.equal(VA_FORM4192_URL);
    form.unmount();
  });
});
