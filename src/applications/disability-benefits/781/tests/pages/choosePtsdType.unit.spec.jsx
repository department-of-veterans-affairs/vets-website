import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectCheckbox,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../../../526EZ/tests/schema/initialData.js';

describe('Disability benefits 718 PTSD type', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.introductionPage.pages.ptsdType;

  it('renders ptsd type form', () => {
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

    expect(form.find('input').length).to.equal(4);
  });

  it('should fill in ptsd type information', () => {
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

    selectCheckbox(
      form,
      'root_view:selectablePtsdTypes_view:combatPtsdType',
      true,
    );
    selectCheckbox(
      form,
      'root_view:selectablePtsdTypes_view:mstPtsdType',
      true,
    );
    selectCheckbox(
      form,
      'root_view:selectablePtsdTypes_view:assaultPtsdType',
      true,
    );
    selectCheckbox(
      form,
      'root_view:selectablePtsdTypes_view:noncombatPtsdType',
      true,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should allow submission if no PTSD types selected', () => {
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

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
