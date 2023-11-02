import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from '~/platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformation.pages.veteranInformation;

describe('Chapter 31 veteran information', () => {
  it('should render', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.container.querySelectorAll('input').length).to.equal(4);
  });

  it('should submit with the required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    const formDom = getFormDOM(form);
    formDom.fillData('input#root_veteranInformation_fullName_first', 'John');
    formDom.fillData('input#root_veteranInformation_fullName_last', 'Doe');
    formDom.fillData('#root_veteranInformation_dobMonth', 1);
    formDom.fillData('#root_veteranInformation_dobDay', 1);
    formDom.fillData('input#root_veteranInformation_dobYear', 1991);
    formDom.submitForm();

    expect(form.container.querySelectorAll('.usa-input-error').length).to.equal(
      0,
    );

    expect(onSubmit.called).to.be.true;
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    const formDom = getFormDOM(form);
    formDom.submitForm();
    expect(form.container.querySelectorAll('.usa-input-error').length).to.equal(
      3,
    );
    expect(onSubmit.called).to.be.false;
  });
});
