import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../../0994/config/form.js';

describe('Education History', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.educationHistory.pages.educationCompleted;

  it('renders the education page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );

    expect(form.find('select').length).to.equal(1);

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

  it('renders text box when other is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          highestLevelofEducation: 'other',
        }}
        formData={{}}
      />,
    );
    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });
});
