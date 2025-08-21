import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';
import initialData from '../initialData';

describe('Hospitalization Interview Questions', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.hospitalizationHistory;

  it('should render hospital info form', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form);
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should add a hospital', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    //  No fields are required
    fillData(
      form,
      'input#root_unemployability_hospitalProvidedCare_0_name',
      'Local facility',
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    expect(form.find('.usa-input-error').length).to.equal(0);
    form.unmount();
  });
});
