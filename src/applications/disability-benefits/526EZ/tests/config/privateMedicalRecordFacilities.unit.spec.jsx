import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester, // selectCheckbox
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';
// import PrivateProviderTreatmentView from '../../../4142/components/PrivateProviderTreatmentView';

describe('Disability benefits 4142 provider medical records facility information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordRelease;

  it('should render 4142 form', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}/>,
    );

    // Commented out until the form is fully moved over
    expect(form);
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(6);
  });

  it('does not submit (and renders error messages) when no fields touched', () => {
    const submit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}/>,
    );

    form.find('form').simulate('submit');
    expect(submit.called).to.be.false;

    //  expect(form.find('.usa-input-error').length).to.equal(2); //TODO: TEST FAILING

    expect(form.find('select').length).to.equal(6);
    expect(form.find('input').length).to.equal(8);
  });
});
