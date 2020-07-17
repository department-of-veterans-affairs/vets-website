import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../../0994/config/form.js';

describe('Training programs choice page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.programSelection.pages.trainingProgramsChoice;

  it('renders the training programs choice page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);

    form.unmount();
  });

  it('renders message when Not yet selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          hasSelectedPrograms: false,
        }}
        formData={{}}
      />,
    );

    expect(form.find('p').length).to.equal(2);
    form.unmount();
  });

  it('successfully submits', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
